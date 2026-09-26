const DEFAULT_SOVRN_API_KEY = "5a212525260f08e97003c07bc18c83f7";

/** Sovrn Commerce (vglnk). Pair Amazon links with `AMAZON_NOREWRITE_CLASS`. */
export function SovrnCommerceScript() {
  const key =
    (import.meta.env.VITE_SOVRN_API_KEY as string | undefined)?.trim() || DEFAULT_SOVRN_API_KEY;

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `var vglnk={key:${JSON.stringify(key)}};(function(d,t){var s=d.createElement(t);s.type="text/javascript";s.async=true;s.src="//cdn.viglink.com/api/vglnk.js";var r=d.getElementsByTagName(t)[0];r.parentNode.insertBefore(s,r)}(document,"script"));`,
      }}
    />
  );
}
