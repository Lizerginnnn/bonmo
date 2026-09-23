import "./backdrop.css";

/** Размытые цветные пятна на фоне страницы */
export function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <div className="backdrop__blob backdrop__blob--peach" />
      <div className="backdrop__blob backdrop__blob--sage" />
      <div className="backdrop__blob backdrop__blob--powder" />
    </div>
  );
}
