import { Fragment } from 'react';
import Link from './NavigationLink';

// ポータルで編集した文章の簡単な書式: 改行 → <br />、*強調* → 強調表示。
// highlight を渡すと強調部分をその class の <span> に、渡さなければ <em> にする。
export function RichText({ text, highlight }) {
    const lines = String(text ?? '').split('\n');
    return lines.map((line, i) => (
        <Fragment key={i}>
            {i > 0 && <br />}
            {line.split(/\*([^*]+)\*/).map((part, j) => {
                if (j % 2 === 0) return part;
                return highlight ? <span key={j} className={highlight}>{part}</span> : <em key={j}>{part}</em>;
            })}
        </Fragment>
    ));
}

// "/" で始まればサイト内リンク、それ以外は新しいタブで開く外部リンク。
export function SmartLink({ href, children, ...props }) {
    if (typeof href === 'string' && href.startsWith('/')) return <Link to={href} {...props}>{children}</Link>;
    return <a href={href} target="_blank" rel="noreferrer" {...props}>{children}</a>;
}
