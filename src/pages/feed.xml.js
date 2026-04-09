import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

function getPostDate(post) {
    const match = post.id.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) return new Date(`${match[1]}-${match[2]}-${match[3]}T00:00:00Z`);
    return new Date(0);
}

function getPostUrl(post) {
    const match = post.id.match(/^(\d{4})-(\d{2})-\d{2}-(.+?)(?:\.md)?$/);
    if (match) return `/blog/${match[1]}/${match[2]}/${match[3]}/`;
    return `/blog/${post.id.replace(/\.md$/, "")}/`;
}

export async function GET(context) {
    const posts = await getCollection('blog');
    const sorted = posts.sort((a, b) => getPostDate(b).getTime() - getPostDate(a).getTime());
    const latest = sorted.slice(0, 10);

    return rss({
        title: 'ESLint Blog',
        description: 'The latest news, updates, and release notes from the ESLint team.',
        site: context.site || 'https://eslint.org',
        items: latest.map((post) => ({
            title: post.data.title,
            pubDate: getPostDate(post),
            link: getPostUrl(post),
            content: post.body || '',
        })),
    });
}
