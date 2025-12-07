export default function ImagePreview({ image }) {
  return (
    <div className="p-4 bg-white rounded-xl shadow w-full flex items-center justify-center">
      {image ? (
        <img src={image} alt="Generated" className="max-w-full rounded" />
      ) : (
        <p className="text-gray-500">No image generated yet</p>
      )}
    </div>
  );
}
