import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import TopRightMenu from 'app/components/modules/TopRightMenu';
import Icon from 'app/components/elements/Icon';
import resolveRoute from 'app/ResolveRoute';
import DropdownMenu from 'app/components/elements/DropdownMenu';
import shouldComponentUpdate from 'app/utils/shouldComponentUpdate';
import HorizontalMenu from 'app/components/elements/HorizontalMenu';
import normalizeProfile from 'app/utils/NormalizeProfile';
import tt from 'counterpart';
import { APP_NAME } from 'app/client_config';

function sortOrderToLink(so, topic, account) {
    if (so === 'home') return '/@' + account + '/feed';
    if (topic) return `/${so}/${topic}`;
    return `/${so}`;
}

class Header extends React.Component {
    static propTypes = {
        location: React.PropTypes.object.isRequired,
        current_account_name: React.PropTypes.string,
        account_meta: React.PropTypes.object,
    };

    constructor() {
        super();
        this.state = { subheader_hidden: false };
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'Header');
        this.hideSubheader = this.hideSubheader.bind(this);
    }

    componentDidMount() {
        window.addEventListener('scroll', this.hideSubheader, {
            capture: false,
            passive: true,
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location.pathname !== this.props.location.pathname) {
            const route = resolveRoute(nextProps.location.pathname);
            if (
                route &&
                route.page === 'PostsIndex' &&
                route.params &&
                route.params.length > 0
            ) {
                const sort_order =
                    route.params[0] !== 'home' ? route.params[0] : null;
                if (sort_order)
                    window.last_sort_order = this.last_sort_order = sort_order;
            }
        }
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.hideSubheader);
    }

    hideSubheader() {
        const subheader_hidden = this.state.subheader_hidden;
        const y =
            window.scrollY >= 0
                ? window.scrollY
                : document.documentElement.scrollTop;
        if (y === this.prevScrollY) return;

        if (y < 5) {
            this.setState({ subheader_hidden: false });
        } else if (y > this.prevScrollY) {
            if (!subheader_hidden) this.setState({ subheader_hidden: true });
        } else {
            if (subheader_hidden) this.setState({ subheader_hidden: false });
        }
        this.prevScrollY = y;
    }

    render() {
        const route = resolveRoute(this.props.location.pathname);
        const current_account_name = this.props.current_account_name;
        let home_account = false;
        let page_title = route.page;

        let sort_order = '';
        let topic = '';
        let user_name = null;
        let page_name = null;
        this.state.subheader_hidden = false;
        if (route.page === 'PostsIndex') {
            sort_order = route.params[0];
            if (sort_order === 'home') {
                page_title = tt('header_jsx.home');
                const account_name = route.params[1];
                if (
                    current_account_name &&
                    account_name.indexOf(current_account_name) === 1
                )
                    home_account = true;
            } else {
                topic = route.params.length > 1 ? route.params[1] : '';
                const type =
                    route.params[0] == 'payout_comments' ? 'comments' : 'posts';
                let prefix = route.params[0];
                if (prefix == 'created') prefix = 'New';
                if (prefix == 'payout') prefix = 'Pending payout';
                if (prefix == 'payout_comments') prefix = 'Pending payout';
                if (topic !== '') prefix += ` ${topic}`;
                page_title = `${prefix} ${type}`;
            }
        } else if (route.page === 'Post') {
            sort_order = '';
            topic = route.params[0];
        } else if (route.page == 'SubmitPost') {
            page_title = tt('header_jsx.create_a_post');
        } else if (route.page == 'Privacy') {
            page_title = tt('navigation.privacy_policy');
        } else if (route.page == 'Tos') {
            page_title = tt('navigation.terms_of_service');
        } else if (route.page == 'ChangePassword') {
            page_title = tt('header_jsx.change_account_password');
        } else if (route.page == 'CreateAccount') {
            page_title = tt('header_jsx.create_account');
        } else if (route.page == 'PickAccount') {
            page_title = `Pick Your New Steemit Account`;
            this.state.subheader_hidden = true;
        } else if (route.page == 'Approval') {
            page_title = `Account Confirmation`;
            this.state.subheader_hidden = true;
        } else if (
            route.page == 'RecoverAccountStep1' ||
            route.page == 'RecoverAccountStep2'
        ) {
            page_title = tt('header_jsx.stolen_account_recovery');
        } else if (route.page === 'UserProfile') {
            user_name = route.params[0].slice(1);
            const acct_meta = this.props.account_meta.getIn([user_name]);
            const name = acct_meta
                ? normalizeProfile(acct_meta.toJS()).name
                : null;
            const user_title = name ? `${name} (@${user_name})` : user_name;
            page_title = user_title;
            if (route.params[1] === 'followers') {
                page_title =
                    tt('header_jsx.people_following') + ' ' + user_title;
            }
            if (route.params[1] === 'followed') {
                page_title =
                    tt('header_jsx.people_followed_by') + ' ' + user_title;
            }
            if (route.params[1] === 'curation-rewards') {
                page_title =
                    tt('header_jsx.curation_rewards_by') + ' ' + user_title;
            }
            if (route.params[1] === 'author-rewards') {
                page_title =
                    tt('header_jsx.author_rewards_by') + ' ' + user_title;
            }
            if (route.params[1] === 'recent-replies') {
                page_title = tt('header_jsx.replies_to') + ' ' + user_title;
            }
            // @user/"posts" is deprecated in favor of "comments" as of oct-2016 (#443)
            if (route.params[1] === 'posts' || route.params[1] === 'comments') {
                page_title = tt('header_jsx.comments_by') + ' ' + user_title;
            }
        } else {
            page_name = ''; //page_title = route.page.replace( /([a-z])([A-Z])/g, '$1 $2' ).toLowerCase();
        }

        // Format first letter of all titles and lowercase user name
        if (route.page !== 'UserProfile') {
            page_title =
                page_title.charAt(0).toUpperCase() + page_title.slice(1);
        }

        if (
            process.env.BROWSER &&
            (route.page !== 'Post' && route.page !== 'PostNoCategory')
        )
            document.title = page_title + ' — ' + APP_NAME;

        const logo_link =
            route.params && route.params.length > 1 && this.last_sort_order
                ? '/' + this.last_sort_order
                : current_account_name ? `/@${current_account_name}/feed` : '/';
        const topic_link = topic ? (
            <Link to={`/${this.last_sort_order || 'trending'}/${topic}`}>
                {topic}
            </Link>
        ) : null;

        const sort_orders = [
            ['trending', tt('main_menu.trending')],
            ['created', tt('g.new')],
            ['hot', tt('main_menu.hot')],
            ['promoted', tt('g.promoted')],
        ];
        if (current_account_name)
            sort_orders.unshift(['home', tt('header_jsx.home')]);
        const sort_order_menu = sort_orders
            .filter(so => so[0] !== sort_order)
            .map(so => ({
                link: sortOrderToLink(so[0], topic, current_account_name),
                value: so[1],
            }));
        const selected_sort_order = sort_orders.find(
            so => so[0] === sort_order
        );

        const sort_orders_horizontal = [
            ['trending', tt('main_menu.trending')],
            ['created', tt('g.new')],
            ['hot', tt('main_menu.hot')],
            ['promoted', tt('g.promoted')],
        ];
        // if (current_account_name) sort_orders_horizontal.unshift(['home', tt('header_jsx.home')]);
        const sort_order_menu_horizontal = sort_orders_horizontal.map(so => {
            let active = so[0] === sort_order;
            if (so[0] === 'home' && sort_order === 'home' && !home_account)
                active = false;
            return {
                link: sortOrderToLink(so[0], topic, current_account_name),
                value: so[1],
                active,
            };
        });

        return (
            <header className="Header noPrint">
                <div className="Header__top header">
                    <div className="expanded row">
                        <div className="columns">
                            <ul className="menu Header__menu">
                                <li className="Header__logo">
                                    <Link to={logo_link}>
                                        {/*
                                        <Icon name="logo" className="logo-for-mobile" />
                                        <Icon name="logotype" className="logo-for-large" />  */}

                                        <svg
                                            className="logo-new logo-new--mobile"
                                            viewBox="0 0 38 38"
                                            version="1.1"
                                        >
                                            <title>Steemit Logo</title>
                                            <g
                                                stroke="none"
                                                fill="none"
                                                fillRule="evenodd"
                                            >
                                                <g
                                                    className="icon-svg"
                                                    fillRule="nonzero"
                                                >
                                                    <path
                                                        d="M32.7004951,11.3807248 C31.1310771,9.81140963 29.3043776,8.66313021 27.3619013,7.92312792 C28.4939405,4.59311764 32.5075339,3.38104493 32.5075339,3.38104493 C32.5075339,3.38104493 23.1424826,-1.48000457 12.7997611,0.459311764 C9.35218721,1.00793415 6.0461183,3.12587173 3.62767097,5.92001831 C-1.62087426,11.9803819 -0.926213868,21.1028239 5.18422484,26.3083572 C6.1233028,27.1121528 8.22014805,28.3625014 8.2587403,28.4262947 C6.8822836,31.9221676 2.48276772,32.8790671 2.48276772,32.8790671 C2.48276772,32.8790671 8.29733255,36.5152853 16.10583,37.4594261 C18.1769471,37.7145993 20.3767051,37.7783926 22.6536475,37.5359781 C26.2684544,37.2425289 29.8703972,35.3287299 32.6104465,32.6366526 C38.5407881,26.7931863 38.5922444,17.2752258 32.7004951,11.3807248 Z M30.0247661,30.3145765 C27.8121441,32.4835487 24.5060752,33.861484 21.9589871,34.0528639 C20.1580157,34.2314851 18.2284034,34.2570024 16.3759757,34.0273465 C13.6487905,33.6956214 11.680586,32.9428604 9.75097374,32.2156168 C10.7286439,31.271476 11.7063141,29.9700926 12.1051006,28.8473305 C12.3623823,28.1838802 12.3366541,27.4438779 12.0279162,26.7931863 C9.95679906,22.5317938 10.8572848,17.4283297 14.2662664,14.1110781 C16.73617,11.6996913 20.1322875,10.5641706 23.5798614,10.9852064 C26.1140854,11.2914142 28.416756,12.4014176 30.2177274,14.2003887 C34.5915151,18.5893678 34.4371461,26.014908 30.0247661,30.3145765 Z"
                                                        className="icon-svg__shape"
                                                    />
                                                </g>
                                            </g>
                                        </svg>
                                        <img src={require('app/assets/images/logo.jpg')} width="72px" height="50px"/>
                                    </Link>
                                </li>
                                <li className="Header__top-steemit show-for-medium noPrint">
                                    <Link to={logo_link}>
                                        <span className="beta fade-in--10">
                                            beta
                                        </span>
                                    </Link>
                                </li>
                                {selected_sort_order && (
                                    <DropdownMenu
                                        className="Header__sort-order-menu menu-hide-for-large"
                                        items={sort_order_menu}
                                        selected={selected_sort_order[1]}
                                        el="li"
                                    />
                                )}
                                <HorizontalMenu
                                    className="show-for-medium Header__sort"
                                    items={sort_order_menu_horizontal}
                                />
                                <li className={'hide-for-large Header__search'}>
                                    <a
                                        href="/static/search.html"
                                        title={tt('g.search')}
                                    >
                                        <Icon name="search" size="1x" />
                                    </a>
                                </li>
                                <li className={'show-for-large Header__search'}>
                                    <form
                                        className="input-group"
                                        action="/static/search.html"
                                        method="GET"
                                    >
                                        <button
                                            className="input-group-button"
                                            href="/static/search.html"
                                            type="submit"
                                            title={tt('g.search')}
                                        >
                                            <Icon name="search" size="1_5x" />
                                        </button>
                                        <input
                                            className="input-group-field"
                                            type="text"
                                            placeholder="search"
                                            name="q"
                                            autoComplete="off"
                                        />
                                    </form>
                                </li>
                            </ul>
                        </div>
                        <div className="columns shrink">
                            <TopRightMenu {...this.props} />
                        </div>
                    </div>
                </div>
            </header>
        );
    }
}

export { Header as _Header_ };

export default connect(state => {
    const current_user = state.user.get('current');
    const account_user = state.global.get('accounts');
    const current_account_name = current_user
        ? current_user.get('username')
        : state.offchain.get('account');
    return {
        location: state.app.get('location'),
        current_account_name,
        account_meta: account_user,
    };
})(Header);
