import { Header } from '@/components';
import type { JSX } from 'react';

interface PageLayoutProps {
    id: string,
    children: JSX.Element | JSX.Element[]
}

const PageLayout = ({ id, children }: PageLayoutProps) => {
    return (
        <section className="app-page" id={id}>
            <Header />
            <div className="main-area">
                <div className="inner-container">
                    <div className="content-area">
                        {children}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PageLayout;