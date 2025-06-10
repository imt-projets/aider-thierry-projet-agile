export const Header = () => {

    const renderNav = () => {
        return NAVIGATION.map((navLink, index) => 
            <li key={index}>
                <a className='nav-item' href={navLink.path}>
                    {navLink.title}
                </a>
            </li>
        );
    }

    return (
        <div className="navigation--drawer">
            <ul>
                {renderNav()}
            </ul>
        </div>
    )

}

interface NavigationItem {
    title: string
    path : string
}

const NAVIGATION : NavigationItem[] = [
    {
        title: 'Home',
        path: '/'
    },
    {
        title: 'Items',
        path: '/items'
    },
    {
        title : 'Inventaire à confirmer',
        path : '/inventory-confirmation'
    }
] 