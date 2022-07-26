/* eslint-disable no-use-before-define, no-param-reassign */
/**
 * This file is inspired from @codemirror/lint package https://github.com/codemirror/lint
 * We added custom styles and tooltips content as per our theme and design
 */

import React from "react";
import * as ReactDOM from "react-dom/client";
import { Decoration, EditorView, ViewPlugin, logException, WidgetType } from "@codemirror/view";
import { StateEffect, StateField, Facet } from "@codemirror/state";
import { hoverTooltip } from "@codemirror/tooltip";
import { showPanel } from "@codemirror/panel";
import elt from "crelt";
import Popup from "../components/Popup";

class SelectedDiagnostic {
    constructor(from, to, diagnostic) {
        this.from = from;
        this.to = to;
        this.diagnostic = diagnostic;
    }
}

class LintState {
    constructor(diagnostics, panel, selected) {
        this.diagnostics = diagnostics;
        this.panel = panel;
        this.selected = selected;
    }
    static init(diagnostics, panel, state) {
        const ranges = Decoration.set(diagnostics.map(d =>

            // For zero-length ranges or ranges covering only a line break, create a widget
            (d.from === d.to || (d.from === d.to - 1 && state.doc.lineAt(d.from).to === d.from)
                ? Decoration.widget({
                    widget: new DiagnosticWidget(d),
                    diagnostic: d
                }).range(d.from)
                : Decoration.mark({
                    attributes: { class: `cm-lintRange cm-lintRange-${d.severity}` },
                    diagnostic: d
                }).range(d.from, d.to))), true);

        return new LintState(ranges, panel, findDiagnostic(ranges));
    }
}

function findDiagnostic(diagnostics, diagnostic = null, after = 0) {
    let found = null;

    diagnostics.between(after, 1e9, (from, to, { spec }) => {
        if (diagnostic && spec.diagnostic !== diagnostic) {
            return;
        }
        found = new SelectedDiagnostic(from, to, spec.diagnostic);
        // eslint-disable-next-line consistent-return
        return false;
    });
    return found;
}

function maybeEnableLint(state, effects) {
    return state.field(lintState, false) ? effects : effects.concat(StateEffect.appendConfig.of([
        lintState,
        // eslint-disable-next-line no-shadow
        EditorView.decorations.compute([lintState], state => {
            const { selected, panel } = state.field(lintState);

            return !selected || !panel || selected.from === selected.to ? Decoration.none : Decoration.set([
                activeMark.range(selected.from, selected.to)
            ]);
        }),
        hoverTooltip(lintTooltip),
        baseTheme
    ]));
}

/**
 * Returns a transaction spec which updates the current set of
 * diagnostics, and enables the lint extension if if wasn't already
 * active.
 * @param state
 * @param diagnostics
 */
function setDiagnostics(state, diagnostics) {
    return {
        effects: maybeEnableLint(state, [setDiagnosticsEffect.of(diagnostics)])
    };
}

/**
 * The state effect that updates the set of active diagnostics. Can
 * be useful when writing an extension that needs to track these.
 */
const setDiagnosticsEffect = /* @__PURE__*/StateEffect.define();
const togglePanel = /* @__PURE__*/StateEffect.define();
const movePanelSelection = /* @__PURE__*/StateEffect.define();

const lintState = /* @__PURE__*/StateField.define({
    create() {
        return new LintState(Decoration.none, null, null);
    },
    update(value, tr) {
        if (tr.docChanged) {
            const mapped = value.diagnostics.map(tr.changes);
            let selected = null;

            if (value.selected) {
                const selPos = tr.changes.mapPos(value.selected.from, 1);

                selected = findDiagnostic(mapped, value.selected.diagnostic, selPos) || findDiagnostic(mapped, null, selPos);
            }
            value = new LintState(mapped, value.panel, selected);
        }
        for (const effect of tr.effects) {
            if (effect.is(setDiagnosticsEffect)) {
                value = LintState.init(effect.value, value.panel, tr.state);
            } else if (effect.is(togglePanel)) {
                value = new LintState(value.diagnostics, effect.value ? LintPanel.open : null, value.selected);
            } else if (effect.is(movePanelSelection)) {
                value = new LintState(value.diagnostics, value.panel, effect.value);
            }
        }
        return value;
    },
    provide: f => [showPanel.from(f, val => val.panel),
        EditorView.decorations.from(f, s => s.diagnostics)]
});

const activeMark = /* @__PURE__*/Decoration.mark({ class: "cm-lintRange cm-lintRange-active" });

function lintTooltip(view, pos, side) {
    const { diagnostics } = view.state.field(lintState);
    const found = [];
    let stackStart = 2e8,
        stackEnd = 0;

    diagnostics.between(pos - (side < 0 ? 1 : 0), pos + (side > 0 ? 1 : 0), (from, to, { spec }) => {
        if (pos >= from && pos <= to &&
            (from === to || ((pos > from || side > 0) && (pos < to || side < 0)))) {
            found.push(spec.diagnostic);
            stackStart = Math.min(from, stackStart);
            stackEnd = Math.max(to, stackEnd);
        }
    });
    if (!found.length) {
        return null;
    }
    return {
        pos: stackStart,
        end: stackEnd,
        above: view.state.doc.lineAt(stackStart).to < stackEnd,
        create() {
            return { dom: diagnosticsTooltip(view, found) };
        }
    };
}
function diagnosticsTooltip(view, diagnostics) {
    return elt("div", { style: "opacity: hidden" }, diagnostics.map(d => renderDiagnostic(view, d, false)));
}

/**
 * Command to close the lint panel, when open.
 * @param view
 */
const closeLintPanel = view => {
    const field = view.state.field(lintState, false);

    if (!field || !field.panel) {
        return false;
    }
    view.dispatch({ effects: togglePanel.of(false) });
    return true;
};

const lintPlugin = /* @__PURE__*/ViewPlugin.fromClass(class {
    constructor(view) {
        this.view = view;
        this.timeout = -1;
        this.set = true;
        const { delay } = view.state.facet(lintSource);

        this.lintTime = Date.now() + delay;
        this.run = this.run.bind(this);
        this.timeout = setTimeout(this.run, delay);
    }
    run() {
        const now = Date.now();

        if (now < this.lintTime - 10) {
            setTimeout(this.run, this.lintTime - now);
        } else {
            this.set = false;
            const { state } = this.view,
                { sources } = state.facet(lintSource);

            Promise.all(sources.map(source => Promise.resolve(source(this.view)))).then(annotations => {
                const all = annotations.reduce((a, b) => a.concat(b));

                if (this.view.state.doc === state.doc) {
                    this.view.dispatch(setDiagnostics(this.view.state, all));
                }
            }, error => {
                logException(this.view.state, error);
            });
        }
    }
    update(update) {
        const source = update.state.facet(lintSource);

        if (update.docChanged || source !== update.startState.facet(lintSource)) {
            this.lintTime = Date.now() + source.delay;
            if (!this.set) {
                this.set = true;
                this.timeout = setTimeout(this.run, source.delay);
            }
        }
    }
    force() {
        if (this.set) {
            this.lintTime = Date.now();
            this.run();
        }
    }
    destroy() {
        clearTimeout(this.timeout);
    }
});

const lintSource = /* @__PURE__*/Facet.define({
    combine(input) {
        return { sources: input.map(i => i.source), delay: input.length ? Math.max(...input.map(i => i.delay)) : 750 };
    },
    enables: lintPlugin
});

/**
 * Given a diagnostic source, this function returns an extension that
 * enables linting with that source. It will be called whenever the
 * editor is idle (after its content changed).
 * @param source
 * @param config
 */
function linter(source, config = {}) {
    // eslint-disable-next-line no-underscore-dangle
    let _a;

    return lintSource.of({ source, delay: (_a = config.delay) !== null && _a !== void 0 ? _a : 750 });
}

function assignKeys(actions) {
    const assigned = [];

    if (actions) {
        // eslint-disable-next-line no-label-var, no-labels
        actions: for (const { name } of actions) {
            for (let i = 0; i < name.length; i++) {
                const ch = name[i];

                if (/[a-zA-Z]/u.test(ch) && !assigned.some(c => c.toLowerCase() === ch.toLowerCase())) {
                    assigned.push(ch);
                    // eslint-disable-next-line no-labels
                    continue actions;
                }
            }
            assigned.push("");
        }
    }
    return assigned;
}

function renderDiagnostic(view, diagnostic) {
    const element = document.createElement("div");
    const root = ReactDOM.createRoot(element);

    // clean up ruleName first
    // see https://github.com/codemirror/lang-javascript/blob/749ed7d353caab74996f3ad98c9c963a0ac646a7/src/eslint.ts#L51
    const ruleName = diagnostic.source.replace(/^jshint:?/u, "");

    root.render(
        <React.StrictMode>
            <Popup
                message={diagnostic.message}
                onFix={diagnostic.actions && (() => diagnostic.actions[0].apply(view, diagnostic.from, diagnostic.to))}
                ruleName={ruleName}
            />
        </React.StrictMode>
    );
    return element;
}

class DiagnosticWidget extends WidgetType {
    constructor(diagnostic) {
        super();
        this.diagnostic = diagnostic;
    }
    eq(other) {
        return other.diagnostic === this.diagnostic;
    }
    toDOM() {
        return elt("span", { class: `cm-lintPoint cm-lintPoint-${this.diagnostic.severity}` });
    }
}

class PanelItem {
    constructor(view, diagnostic) {
        this.diagnostic = diagnostic;
        this.id = `item_${Math.floor(Math.random() * 0xffffffff).toString(16)}`;
        this.dom = renderDiagnostic(view, diagnostic, true);
        this.dom.id = this.id;
        this.dom.setAttribute("role", "option");
    }
}

class LintPanel {
    constructor(view) {
        this.view = view;
        this.items = [];
        const onkeydown = event => {
            if (event.keyCode === 27) { // Escape
                closeLintPanel(this.view);
                this.view.focus();
            } else if (event.keyCode === 38 || event.keyCode === 33) { // ArrowUp, PageUp
                this.moveSelection((this.selectedIndex - 1 + this.items.length) % this.items.length);
            } else if (event.keyCode === 40 || event.keyCode === 34) { // ArrowDown, PageDown
                this.moveSelection((this.selectedIndex + 1) % this.items.length);
            } else if (event.keyCode === 36) { // Home
                this.moveSelection(0);
            } else if (event.keyCode === 35) { // End
                this.moveSelection(this.items.length - 1);
            } else if (event.keyCode === 13) { // Enter
                this.view.focus();
            } else if (event.keyCode >= 65 && event.keyCode <= 90 && this.selectedIndex >= 0) { // A-Z
                const { diagnostic } = this.items[this.selectedIndex],
                    keys = assignKeys(diagnostic.actions);

                for (let i = 0; i < keys.length; i++) {
                    if (keys[i].toUpperCase().charCodeAt(0) === event.keyCode) {
                        const found = findDiagnostic(this.view.state.field(lintState).diagnostics, diagnostic);

                        if (found) {
                            diagnostic.actions[i].apply(view, found.from, found.to);
                        }
                    }
                }
            } else {
                return;
            }
            event.preventDefault();
        };
        const onclick = event => {
            for (let i = 0; i < this.items.length; i++) {
                if (this.items[i].dom.contains(event.target)) {
                    this.moveSelection(i);
                }
            }
        };

        this.list = elt("ul", {
            tabIndex: 0,
            role: "listbox",
            "aria-label": this.view.state.phrase("Diagnostics"),
            onkeydown,
            onclick
        });
        this.dom = elt("div", { class: "cm-panel-lint" }, this.list, elt("button", {
            type: "button",
            name: "close",
            "aria-label": this.view.state.phrase("close"),
            onclick: () => closeLintPanel(this.view)
        }, "×"));
        this.update();
    }
    get selectedIndex() {
        const selected = this.view.state.field(lintState).selected;

        if (!selected) {
            return -1;
        }
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].diagnostic === selected.diagnostic) {
                return i;
            }
        }
        return -1;
    }
    update() {
        const { diagnostics, selected } = this.view.state.field(lintState);
        let i = 0,
            needsSync = false,
            newSelectedItem = null;

        diagnostics.between(0, this.view.state.doc.length, (_start, _end, { spec }) => {
            let found = -1,
                item;

            for (let j = i; j < this.items.length; j++) {
                if (this.items[j].diagnostic === spec.diagnostic) {
                    found = j;
                    break;
                }
            }
            if (found < 0) {
                item = new PanelItem(this.view, spec.diagnostic);
                this.items.splice(i, 0, item);
                needsSync = true;
            } else {
                item = this.items[found];
                if (found > i) {
                    this.items.splice(i, found - i);
                    needsSync = true;
                }
            }
            if (selected && item.diagnostic === selected.diagnostic) {
                if (!item.dom.hasAttribute("aria-selected")) {
                    item.dom.setAttribute("aria-selected", "true");
                    newSelectedItem = item;
                }
            } else if (item.dom.hasAttribute("aria-selected")) {
                item.dom.removeAttribute("aria-selected");
            }
            i++;
        });
        while (i < this.items.length && !(this.items.length === 1 && this.items[0].diagnostic.from < 0)) {
            needsSync = true;
            this.items.pop();
        }
        if (this.items.length === 0) {
            this.items.push(new PanelItem(this.view, {
                from: -1,
                to: -1,
                severity: "info",
                message: this.view.state.phrase("No diagnostics")
            }));
            needsSync = true;
        }
        if (newSelectedItem) {
            this.list.setAttribute("aria-activedescendant", newSelectedItem.id);
            this.view.requestMeasure({
                key: this,
                read: () => ({ sel: newSelectedItem.dom.getBoundingClientRect(), panel: this.list.getBoundingClientRect() }),
                write: ({ sel, panel }) => {
                    if (sel.top < panel.top) {
                        this.list.scrollTop -= panel.top - sel.top;
                    } else if (sel.bottom > panel.bottom) {
                        this.list.scrollTop += sel.bottom - panel.bottom;
                    }
                }
            });
        } else if (this.selectedIndex < 0) {
            this.list.removeAttribute("aria-activedescendant");
        }
        if (needsSync) {
            this.sync();
        }
    }
    sync() {
        let domPos = this.list.firstChild;

        function rm() {
            const prev = domPos;

            domPos = prev.nextSibling;
            prev.remove();
        }
        for (const item of this.items) {
            if (item.dom.parentNode === this.list) {
                while (domPos !== item.dom) {
                    rm();
                }
                domPos = item.dom.nextSibling;
            } else {
                this.list.insertBefore(item.dom, domPos);
            }
        }
        while (domPos) {
            rm();
        }
    }
    moveSelection(selectedIndex) {
        if (this.selectedIndex < 0) {
            return;
        }
        const field = this.view.state.field(lintState);
        const selection = findDiagnostic(field.diagnostics, this.items[selectedIndex].diagnostic);

        if (!selection) {
            return;
        }
        this.view.dispatch({
            selection: { anchor: selection.from, head: selection.to },
            scrollIntoView: true,
            effects: movePanelSelection.of(selection)
        });
    }
    static open(view) {
        return new LintPanel(view);
    }
}
function svg(content, attrs = "viewBox=\"0 0 40 40\"") {
    return `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" ${attrs}>${encodeURIComponent(content)}</svg>')`;
}
function underline(color) {
    return svg(`<path d="m0 2.5 l2 -1.5 l1 0 l2 1.5 l1 0" stroke="${color}" fill="none" stroke-width=".7"/>`, "width=\"6\" height=\"3\"");
}
const baseTheme = /* @__PURE__*/EditorView.baseTheme({
    ".cm-lintRange": {
        backgroundPosition: "left bottom",
        backgroundRepeat: "repeat-x",
        paddingBottom: "0.7px"
    },
    ".cm-lintRange-error": { backgroundImage: /* @__PURE__*/underline("#d11") },
    ".cm-lintRange-warning": { backgroundImage: /* @__PURE__*/underline("orange") },
    ".cm-lintRange-info": { backgroundImage: /* @__PURE__*/underline("#999") },
    ".cm-lintRange-active": { backgroundColor: "#ffdd9980" },
    ".cm-lintPoint": {
        position: "relative",
        "&:after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: "-2px",
            borderLeft: "3px solid transparent",
            borderRight: "3px solid transparent",
            borderBottom: "4px solid #d11"
        }
    },
    ".cm-lintPoint-warning": {
        "&:after": { borderBottomColor: "orange" }
    },
    ".cm-lintPoint-info": {
        "&:after": { borderBottomColor: "#999" }
    }
});

export { linter, setDiagnostics, setDiagnosticsEffect };
