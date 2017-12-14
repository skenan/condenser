import React from 'react';
import {connect} from 'react-redux'
import {IntlProvider, addLocaleData} from 'react-intl';
import zh from 'react-intl/locale-data/zh';
import {DEFAULT_LANGUAGE} from 'app/client_config';
import tt from 'counterpart';

addLocaleData([...zh]);

tt.registerTranslations('zh', require('app/locales/zh.json'));
tt.setFallbackLocale('zh');


class Translator extends React.Component {
    render() {
        const language = this.props.locale;
        tt.setLocale(language);
        return (
            <IntlProvider
                // to ensure dynamic language change, "key" property with same "locale" info must be added
                // see: https://github.com/yahoo/react-intl/wiki/Components#multiple-intl-contexts
                key={language}
                locale={language}
                defaultLocale={DEFAULT_LANGUAGE}
            >
                {this.props.children}
            </IntlProvider>
        );
    }
}

export default connect(
    (state, ownProps) => {
        const locale = 'zh'; // temporary, real i18n support will be added later

        return {...ownProps, locale};
    }
)(Translator);

export const FormattedHTMLMessage = ({ id, params, className }) => (
    <div
        className={'FormattedHTMLMessage' + (className ? ` ${className}` : '')}
        dangerouslySetInnerHTML={{ __html: tt(id, params) }}
    />
);
