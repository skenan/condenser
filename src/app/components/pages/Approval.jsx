import React from 'react';
import {connect} from 'react-redux';

class Approval extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            confirm_email: false
        }
    }

    componentWillMount() {
        if (this.props.location.query.confirm_email) {
            this.setState({confirm_email: true});
        }
    }

    render() {
        let body = '';
        if (this.state.confirm_email) {
            body = <div>
                <h4>感谢你确认电子邮件！</h4>
                <p>我们将审核你的申请. 一旦通过，我们将发送Email提醒你完成最后一步注册。</p>
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
                <div className="column" style={{maxWidth: '36rem', margin: '0 auto'}}>
                    <div>
                        {body}
                    </div>
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

            }
        },
        dispatch => ({
        })
    )(Approval)
};
