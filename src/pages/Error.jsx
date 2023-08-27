
import error_page from "../assets/Images/error_page.PNG"

function Error() {
  return (
    <div className="flex flex-1 justify-center items-center text-white text-3xl">
            <img
              src={error_page}
              alt=""
              className="object-contain md:object-scale-down"
            />
      {/* Error 404 - Page Not Found */}
    </div>
  );
}
export default Error;





