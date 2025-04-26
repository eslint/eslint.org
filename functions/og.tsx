import React from "https://esm.sh/react@19.1.0"
import { ImageResponse } from "https://deno.land/x/og_edge@0.0.6/mod.ts"

const ESLintLogo = () => (
    <svg width="120" viewBox="0 0 75 65">
        <path
            d="M46.5572 21.1093L34.0167 13.8691C33.7029 13.6879 33.3161 13.6879 33.0023 13.8691L20.4616 21.1093C20.148 21.2905 19.9543 21.6253 19.9543 21.9878V36.4681C19.9543 36.8304 20.148 37.1654 20.4616 37.347L33.0023 44.5871C33.3161 44.7684 33.7029 44.7684 34.0167 44.5871L46.5572 37.347C46.871 37.1657 47.0644 36.8306 47.0644 36.4681V21.9878C47.0641 21.6253 46.8707 21.2905 46.5572 21.1093Z"
            fill="#8080F2"
        >
        </path>
        <path
            d="M0.904381 27.7046L15.8878 1.63772C16.4321 0.695223 17.4375 0 18.5258 0H48.4931C49.5817 0 50.5873 0.695223 51.1316 1.63772L66.115 27.6471C66.6593 28.5899 66.6593 29.7796 66.115 30.7224L51.1316 56.5756C50.5873 57.5181 49.5817 58 48.4931 58H18.526C17.4377 58 16.4321 57.5326 15.8881 56.5899L0.90464 30.6944C0.359854 29.7522 0.359854 28.6471 0.904381 27.7046ZM13.3115 40.2393C13.3115 40.6225 13.5422 40.977 13.8744 41.1689L32.96 52.1803C33.2919 52.3719 33.7078 52.3719 34.0397 52.1803L53.1401 41.1689C53.4721 40.977 53.7043 40.6228 53.7043 40.2393V18.2161C53.7043 17.8327 53.4754 17.4785 53.1432 17.2866L34.0584 6.27513C33.7264 6.08327 33.3111 6.08327 32.9792 6.27513L13.8775 17.2866C13.5453 17.4785 13.3115 17.8327 13.3115 18.2161V40.2393V40.2393Z"
            fill="#4B32C3"
        >
        </path>
    </svg>
)

const regular = fetch("https://eslint.org/assets/fonts/Inter/static/Inter-Regular.ttf")
    .then((res) => res.arrayBuffer())

const bold = fetch("https://eslint.org/assets/fonts/Inter/static/Inter-Bold.ttf")
    .then((res) => res.arrayBuffer())

export default async function handler(req: Request) {
    const regularData = await regular
    const boldData = await bold

    const { searchParams } = new URL(req.url)
    const title = searchParams.get("title")
    const summary = searchParams.get("summary")

    const isRule = searchParams.get("is_rule") === "true"
    const recommended = searchParams.get("recommended") === "true"
    const fixable = searchParams.get("fixable") === "code" || searchParams.get("fixable") === "whitespace"
    const suggestions = searchParams.get("suggestions") === "true"

    return new ImageResponse(
        (
            <div tw="flex w-full h-full bg-white">
                <div tw="flex flex-col m-auto max-w-3/4 max-h-3/4">
                    <ESLintLogo />
                    <div tw="mt-4 mb-6 text-6xl font-bold">
                        {title}
                    </div>
                    <div tw={`text-4xl ${isRule && 'mb-8'}`}>
                        {summary}
                    </div>

                    {isRule &&
                        <div tw="flex text-5xl -ml-3">
                            <div tw={`mx-3 ${!recommended && 'opacity-20'}`}>
                                ✅
                            </div>
                            <div tw={`mx-3 ${!fixable && 'opacity-20'}`}>
                                🛠
                            </div>
                            <div tw={`mx-3 ${!suggestions && 'opacity-20'}`}>
                                💡
                            </div>
                        </div>
                    }
                </div>
            </div>
        ),
        {
            fonts: [
                {
                    name: "Inter",
                    data: regularData,
                    weight: 400,
                    style: "normal",
                },
                {
                    name: "Inter",
                    data: boldData,
                    weight: 900,
                    style: "normal",
                },
            ]
        }
    )
}
