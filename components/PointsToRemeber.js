const PointsToRemeber = () => {
  return (
    <div className="container m-auto items-left justify-center flex flex-col py-8">
      <h3 className="text-2xl">
        There are some points to Remeber Before Using
      </h3>
      <ul className="list-disc list-inside my-4">
        <li className="font-bold">Use only CSV formated files</li>
        <li className="font-bold">
          To convert a file to CSV
          <ul className="list-inside list-decimal ml-10">
            <li className="font-normal">Go to Save as</li>
            <li className="font-normal">Save file as CSV UTF-8</li>
          </ul>
        </li>
        <li className="font-bold">Upload File and Click Submit</li>
      </ul>
    </div>
  )
}

export default PointsToRemeber
