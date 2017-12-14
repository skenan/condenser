import React from 'react';
import { connect } from 'react-redux';
import SvgImage from 'app/components/elements/SvgImage';
import AddToWaitingList from 'app/components/modules/AddToWaitingList';

class SignUp extends React.Component {
    constructor() {
        super();
        this.state = { waiting_list: false };
    }
    render() {
        if ($STM_Config.read_only_mode) {
            return ( 
                <div className="row">
                    <div className="column">
                        <div className="callout alert">
                            <p>由于系统维护，我们只能以只读模式运行，给您带来的不便，深表歉意。</p>
                        </div>
                    </div>
                </div>
            );
        }

        if (this.props.serverBusy || $STM_Config.disable_signups) {
            return (
                <div className="row">
                    <div className="column callout" style={{margin: '20px', padding: '40px'}}>
                        <p>由于注册量过大，会员只能以邀请的方式通过，提交你的Email,进入等待列表。</p>
                        <AddToWaitingList />
                    </div>
                </div>
            );
        }

        return ( <div className="SignUp">
            <div className="row">
                <div className="column">
                    <h3>注册</h3>
                    <p>CNsteem要代理价值 {this.props.signup_bonus} 的Steem Power; 为防止垃圾注册，我们需要验证你的社交媒体<br />
                        你的个人信息是 <a href="/privacy.html" target="_blank">私有的</a>.
                    </p>
                </div>
                <div className="row">
                    <div className="column large-4 shrink">
                        <SvgImage name="facebook" width="64px" height="64px" />
                    </div>
                    <div className="column large-8">
                        <a
                            href="/connect/facebook"
                            className="button SignUp--fb-button"
                        >
                            Continue with Facebook
                        </a>
                    </div>
                </div>
                <div className="column large-8">
                    <a href="/connect/facebook" className="button SignUp--fb-button">通过Facebook继续</a>
                </div>
                <div className="row">
                    <div className="column">
                        <br />
                        Don't have a Facebook or Reddit account? <br />
                        {this.state.waiting_list ? (
                            <AddToWaitingList />
                        ) : (
                            <a
                                href="#"
                                onClick={() =>
                                    this.setState({ waiting_list: true })
                                }
                            >
                                <strong>
                                    {' '}
                                    Subscribe to get a notification when SMS
                                    confirmation is available.
                                </strong>
                            </a>
                        )}
                    </div>
                </div>
                <div className="column large-8">
                    <a href="/connect/reddit" className="button SignUp--reddit-button">通过Reddit继续</a>
                    <br /><span className="secondary">(requires 5 or more Reddit comment karma)</span>
                </div>
            </div>
            <div className="row">
                <div className="column">
                      <br />
                     没有Facebook 或 Reddit 账号? <br />
                    {this.state.waiting_list ? <AddToWaitingList /> : <a href="#" onClick={() => this.setState({waiting_list: true})}>
                        <strong> 当短信验证开启时，收到通知</strong>
                    </a>}
                </div>
            </div>
            <div className="row">
                <div className="column">
                      <br />
                    <p className="secondary">为了通过账户验证，你需要接受CNsteem的 <a href="/tos.html" target="_blank">条款</a>.</p>
                </div>
            </div>
        </div>);
    }
}

export default connect(state => {
    return {
        signup_bonus: state.offchain.get('signup_bonus'),
        serverBusy: state.offchain.get('serverBusy'),
    };
})(SignUp);
