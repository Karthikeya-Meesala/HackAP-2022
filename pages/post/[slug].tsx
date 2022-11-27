import {GetStaticProps, InferGetStaticPropsType} from "next";
import ReactMarkdown from "react-markdown";
import Head from "next/head";
import NotionService from "../../services/notion-service";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Link from "next/link";

const Post = ({markdown, post}: InferGetStaticPropsType<typeof getStaticProps>) => {
    return (
        <>
            <Head>
                <title>{post.title}</title>
                <meta name={"description"} title={"description"} content={post.description}/>
                <meta name={"og:title"} title={"og:title"} content={post.title}/>
                <meta name={"og:description"} title={"og:description"} content={post.description}/>
                <meta name={"og:image"} title={"og:image"} content={post.cover}/>
            </Head>

            <Header></Header>

            <div className="min-h-screen pt-28 pb-24 px-8 lg:px-0 ">
                <main className="max-w-5xl mx-auto relative">
                    <div className="flex items-center justify-center">
                        <article className="prose">
                        <Link className=" underline text-blue-600 font-semibold text-l" href="/#">Go back</Link>
                            <ReactMarkdown>{markdown}</ReactMarkdown>
                        </article>
                        <button> </button>
                    </div>
                </main>
            </div>

            <Footer></Footer>


        </>
    )
}


export const getStaticProps: GetStaticProps = async (context) => {
    const notionService = new NotionService()

    // @ts-ignore
    const p = await notionService.getSingleProfile(context.params?.slug)

    if (!p) {
        throw ''
    }

    return {
        props: {
            markdown: p.markdown,
            post: p.post
        },
    }
}

export async function getStaticPaths() {
    const notionService = new NotionService()

    const posts = await notionService.getPublishedProfiles()

    // Because we are generating static paths, you will have to redeploy your site whenever
    // you make a change in Notion.
    const paths = posts.map(post => {
        return `/post/${post.slug}`
    })

    return {
        paths,
        fallback: false,
    }
}

export default Post;