import React from 'react';
import { connect } from 'react-redux';
import { VIEW_MODE_WHISTLE, WHISTLE_SIGNUP_COMPLETE } from 'shared/constants';

class Approval extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            confirm_email: false,
        };
    }

    componentWillMount() {
        if (this.props.location.query.confirm_email) {
            this.setState({ confirm_email: true });
        }
    }

    render() {
        if (process.env.BROWSER && this.props.viewMode === VIEW_MODE_WHISTLE) {
            window.postMessage(WHISTLE_SIGNUP_COMPLETE);
        }
        let body = '';
        if (this.state.confirm_email) {
            body = <div>
                <h4>感谢你确认电子邮件！</h4>
                <p>我们将审核你的申请. 一旦通过，我们将发送Email提醒你完成最后一步注册, 审核大约需要3-7天。</p>
                <br/> <br/>
                <h4>注册加速</h4>
                <p>前往<a href="https:/cnsteem.io">CNsteem.io</a>快速注册</p>


            </div>
        } else {
            body = <div>
                <h4>请前往邮箱，检查你的电子邮件!</h4>
                <p>查看你的邮件，点击确认完成邮箱验证。</p>
                <p>邮箱验证成功后，我们将审核你的申请. 一旦通过，我们将发送Email提醒你完成注册。</p>
            </div>
        }
        return (
            <div className="row">
                <div
                    className="column"
                    style={{ maxWidth: '36rem', margin: '0 auto' }}
                >
                    <div>{body}</div>
                </div>
            </div>
        );
    }
}

module.exports = {
    path: 'approval',
    component: connect(
        state => {
            return {
                viewMode: state.app.get('viewMode'),
            };
        },
        dispatch => ({})
    )(Approval),
};
