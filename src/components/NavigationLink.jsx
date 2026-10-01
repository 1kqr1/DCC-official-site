import { forwardRef } from 'react';
import { flushSync } from 'react-dom';
import { Link, useLinkClickHandler } from 'react-router-dom';

// Router標準のクリック判定・履歴処理を使い、URLとDOM更新を同じクリック内で確定する。
// Ctrl/Commandクリック、別タブ、外部URL、downloadは通常のリンクとして扱う。
const NavigationLink = forwardRef(function NavigationLink({ to, onClick, ...props }, ref) {
    const handleClick = useLinkClickHandler(to, { ...props, useTransitions: false });
    const browserNavigation = props.reloadDocument || props.download != null
        || (typeof to === 'string' && /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(to));

    return <Link {...props} reloadDocument={Boolean(browserNavigation)} to={to} ref={ref} onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented && !browserNavigation) {
            flushSync(() => handleClick(event));
        }
    }} />;
});

export default NavigationLink;
