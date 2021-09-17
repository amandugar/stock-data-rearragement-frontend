import PointsToRemeber from '../components/PointsToRemeber'
import UploadPage from '../components/UploadPage'

const Home = () => {
  return (
    <>
      <div
        className="py-24 bg-center bg-cover bg-no-repeat flex flex-center items-center justify-center"
        style={{
          backgroundImage:
            'linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),url(https://images.pexels.com/photos/534216/pexels-photo-534216.jpeg)',
        }}
      >
        <h1 className="text-4xl text-white font-bold">Stock Data Summary</h1>
      </div>

      <PointsToRemeber />
      <UploadPage />
    </>
  )
}
export default Home
