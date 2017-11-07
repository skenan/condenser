/* eslint react/prop-types: 0 */
/*global $STM_csrf, $STM_Config */
import React from 'react';
import {connect} from 'react-redux';
import user from 'app/redux/User';
import {api} from 'steem';
import {validate_account_name} from 'app/utils/ChainValidation';
import runTests from 'app/utils/BrowserTests';
import Progress from 'react-foundation-components/lib/global/progress-bar';
import { Link } from 'react-router';

class PickAccount extends React.Component {

    static propTypes = {
        loginUser: React.PropTypes.func.isRequired,
        serverBusy: React.PropTypes.bool
    };

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            password: '',
            password_valid: '',
            name_error: '',
            server_error: '',
            loading: false,
            cryptographyFailure: false,
            showRules: false,
            subheader_hidden: true
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
    }

    componentDidMount() {
        const cryptoTestResult = runTests();
        if (cryptoTestResult !== undefined) {
            console.error('CreateAccount - cryptoTestResult: ', cryptoTestResult);
            this.setState({cryptographyFailure: true}); // TODO: do not use setState in componentDidMount
        }
    }

    onSubmit(e) {
        e.preventDefault();
        this.setState({server_error: '', loading: true});
        const {name} = this.state;
        if (!name) return;

        window.location = "/enter_email?account=" + name;
    }

    onPasswordChange(password, password_valid) {
        this.setState({password, password_valid});
    }

    onNameChange(e) {
        const name = e.target.value.trim().toLowerCase();
        this.validateAccountName(name);
        this.setState({name});
    }

    validateAccountName(name) {
        let name_error = '';
        let promise;
        if (name.length > 0) {
            name_error = validate_account_name(name);
            if (!name_error) {
                this.setState({name_error: ''});
                promise = api.getAccountsAsync([name]).then(res => {
                    return res && res.length > 0 ? '账户名已被占用' : '';
                });
            }
        }
        if (promise) {
            promise
                .then(name_error => this.setState({name_error}))
                .catch(() => this.setState({
                    name_error: "由于系统错误，账号名无法被验证，请稍后再试。"
                }));
        } else {
            this.setState({name_error});
        }
    }

    render() {
        if (!process.env.BROWSER) { // don't render this page on the server
            return <div className="row">
                <div className="column">
                    <p className="text-center">LOADING..</p>
                </div>
            </div>;
        }

        const {
            name, name_error, server_error, loading, cryptographyFailure
        } = this.state;

        const {loggedIn, logout, offchainUser, serverBusy} = this.props;
        const submit_btn_disabled = loading || !name || name_error;
        const submit_btn_class = 'action btn-continue' + (submit_btn_disabled ? ' disabled' : '');

        const account_status = offchainUser ? offchainUser.get('account_status') : null;

        if (serverBusy || $STM_Config.disable_signups) {
            return <div className="row">
                <div className="column">
                    <div className="callout alert">
                        <p>今日注册额度已满，请使用如下两种方式进行注册:</p>
                    </div>

                    <div className="callout success">
                        <p>1. 前往<a href="https://steemit.com/pick_account">steemit.com</a>免费注册，需要1-2天时间审核</p>
                        <p>2. 前往<a href="https://anon.steem.network">anon.steem.network</a>使用加密货币进行付费注册，无需审核时间</p>
                    </div>
                </div>
            </div>;
        }
        if (cryptographyFailure) {
            return <div className="row">
                <div className="column">
                    <div className="callout alert">
                        <h4>浏览器过时</h4>
                        <p>我们无法通过此浏览器创建你的账户。</p>
                        <p>请使用最新版本的<a href="https://www.google.com/chrome/">Chrome</a> 或<a href="https://www.mozilla.org/en-US/firefox/new/">Firefox</a></p>
                    </div>
                </div>
            </div>;
        }

        if (loggedIn) {
            return <div className="row">
                <div className="column">
                    <div className="callout alert">
                        <p>在你创建账户之前，请<a href="#" onClick={logout}>登出</a> 你当前账号.</p>
                        <p>请注意CNsteem只能为一个验证过的用户注册一个账号。</p>
                    </div>
                </div>
            </div>;
        }

        if (account_status === 'waiting') {
            return <div className="row">
                <div className="column">
                    <br />
                    <div className="callout alert">
                        <p>你的注册申请正在处理，当审核通过后，你将收到一封电子邮件。</p>
                        <p>你的注册正在审核，通常需要3-7天。</p>

                        <h4>注册加速</h4>
                        <p>CNsteem是<a href="https://steemit.com" target="_blank">steemit</a>的中文版本，由<a href="/cn/@skenan/cnsteem" target="_blank">skenan</a>创建。</p>
                        <p>为了方便中国用户注册，每创建一个用户，<a href="/@skenan" target="_blank">skenan</a>需要花费0.2 Steem 并代理29 Steem Power。</p>
                        <p>为了加快你的注册，可以通过微信扫描下面的二维码进行小额赞助。</p>
                        <p>备注中请填写你的用户名，赞助后24小时内无法开通，请发邮件到cnsteem@gmail.com</p>
                        <p style={{textAlign:'center'}}><img src={require('app/assets/images/pay.png')} /></p>

                    </div>
                </div>
            </div>;
        }

        if (account_status === 'approved') {
            return <div className="row">
                <div className="column">
                    <br />
                    <div className="callout success">
                        <p>恭喜你，你的账户申请通过啦</p>
                        <p><Link to="/create_account">让我们来创建你的账户。</Link></p>
                    </div>
                </div>
            </div>;
        }

        // const existingUserAccount = offchainUser.get('account');
        // if (existingUserAccount) {
        //     return <div className="row">
        //         <div className="column">
        //             <div className="callout alert">
        //                 <p>Our records indicate that you already have steem account: <strong>{existingUserAccount}</strong></p>
        //                 <p>In order to prevent abuse Steemit can only register one account per verified user.</p>
        //                 <p>You can either <a href="/login.html">login</a> to your existing account
        //                     or <a href="mailto:support@steemit.com">send us email</a> if you need a new account.</p>
        //             </div>
        //         </div>
        //     </div>;
        // }

        let next_step = null;
        if (server_error) {
            if (server_error === 'Email address is not confirmed') {
                next_step = <div className="callout alert">
                    <a href="/enter_email">请验证你的Email地址</a>
                </div>;
            } else if (server_error === 'Phone number is not confirmed') {
                next_step = <div className="callout alert">
                    <a href="/enter_mobile">请验证你的手机号</a>
                </div>;
            } else {
                next_step = <div className="callout alert">
                    <h5>无法创建账户，系统返回以下错误:</h5>
                    <p>{server_error}</p>
                </div>;
            }
        }

        return (
            <div>
                <div className="CreateAccount row">
                    <div className="column" style={{maxWidth: '36rem', margin: '0 auto'}}>
                        <br />
                        <Progress tabIndex="0" value={10} max={100} />
                        <br />
                        <h4 className="CreateAccount__title">注册前请阅读<a href="/cn/@skenan/3p9rbc-cnsteem" target="_blank">这篇文章</a></h4>
                        <div>
                             <p>在steemit官网注册会有20刀注册奖励！请先尝试到<a href="https://steemit.com/pick_account">steemit</a>注册<br />
                                 {/*Your account name <strong>can never be changed</strong>, so please choose carefully.*/}</p>
                        </div>
                        <form onSubmit={this.onSubmit} autoComplete="off" noValidate method="post">
                            <div className={name_error ? 'error' : ''}>
                                <label>选择账户名：</label>
                                <input type="text" name="name" autoComplete="off" onChange={this.onNameChange} value={name} placeholder={"Name..."} />
                                <p>{name_error}</p>
                            </div>
                            <input disabled={submit_btn_disabled} type="submit" className={submit_btn_class} value="Continue" />
                        </form>
                        <br />
                        <p className="secondary">已经拥有账户? <Link to="/login.html">登录</Link></p>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = {
    path: 'pick_account',
    component: connect(
        state => {
            return {
                loggedIn: !!state.user.get('current'),
                offchainUser: state.offchain.get('user'),
                serverBusy: state.offchain.get('serverBusy')
            }
        },
        dispatch => ({
            loginUser: (username, password) => dispatch(user.actions.usernamePasswordLogin({username, password, saveLogin: true})),
            logout: e => {
                if (e) e.preventDefault();
                dispatch(user.actions.logout())
            }
        })
    )(PickAccount)
};
