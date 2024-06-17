export default function NodeMetadata({ entity }) {
  const title = entity?.title;
  const status = entity?.status;

  if (status === true || status === undefined) {
    return null;
  }

  return (
    <div className="mb-4 bg-red-100/50 p-4">
      {status === false && (
        <p>
          {'"'}
          {title}
          {'"'} is an unpublished content.
        </p>
      )}
    </div>
  );
}
