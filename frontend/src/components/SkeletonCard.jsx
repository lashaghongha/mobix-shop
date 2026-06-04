import './SkeletonCard.css';

export default function SkeletonCard() {
  return (
    <div className="skel-card">
      <div className="skel-img skel-shine" />
      <div className="skel-body">
        <div className="skel-line short skel-shine" />
        <div className="skel-line skel-shine" />
        <div className="skel-line skel-shine" />
        <div className="skel-price skel-shine" />
        <div className="skel-btn skel-shine" />
      </div>
    </div>
  );
}
