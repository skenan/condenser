import React from 'react';
import {connect} from 'react-redux'
import {IntlProvider, addLocaleData} from 'react-intl';
import zh from 'react-intl/locale-data/zh';
import {DEFAULT_LANGUAGE} from 'app/client_config';
import tt from 'counterpart';

addLocaleData([...zh]);
const localeDefaults = {
    counterpart: {
        pluralize: (entry, count) => entry[
            (count === 0 && 'zero' in entry)
                ? 'zero' : (count === 1) ? 'one' : 'other'
            ],
        formats: {
            date: {
                'default': '%a, %e. %b %Y',
                'long': '%A, %e. %B %Y',
                'short': '%d.%m.%y'
            },
            time: {
                'default': '%H:%M',
                'long': '%H:%M:%S %z',
                'short': '%H:%M'
            },
            datetime: {
                'default': '%a, %e. %b %Y, %H:%M',
                'long': '%A, %e. %B %Y, %H:%M:%S %z',
                'short': '%d.%m.%y %H:%M'
            }
        }
    }
}
const zhJSON = Object.assign(
    require('app/locales/zh.json'), localeDefaults
)

tt.registerTranslations('zh', zhJSON);
tt.setFallbackLocale('zh');
class Translator extends React.Component {
    render() {
        let language = this.props.locale;
        tt.setLocale(language);
        return <IntlProvider
            // to ensure dynamic language change, "key" property with same "locale" info must be added
            // see: https://github.com/yahoo/react-intl/wiki/Components#multiple-intl-contexts
            key={language}
            locale={language}
            defaultLocale={DEFAULT_LANGUAGE}
        >
            {this.props.children}
        </IntlProvider>
    }
}

export default connect(
    (state, ownProps) => {
        const locale = state.user.get('locale');
        return {...ownProps, locale};
    }
)(Translator);

export const FormattedHTMLMessage = ({id, params, className}) => (
    <div className={'FormattedHTMLMessage' + (className ? ` ${className}` : '')} dangerouslySetInnerHTML={ { __html: tt(id, params) } }></div>
);
