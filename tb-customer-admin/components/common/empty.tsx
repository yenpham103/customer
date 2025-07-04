import Head from 'next/head';

export function EmptyLayout({ children, title }: { children: React.ReactNode, title: string }) {
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
            </Head>
            {children}
        </>
    );
}

EmptyLayout.defaultProps = {
    title: 'SBC Team B - Customer',
};
