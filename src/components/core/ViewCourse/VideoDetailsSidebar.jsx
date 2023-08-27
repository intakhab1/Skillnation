import { useEffect, useState } from "react"
import { BsChevronDown } from "react-icons/bs"
import { IoIosArrowBack } from "react-icons/io"
import { useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"

import IconBtn from "../../Common/IconBtn"

export default function VideoDetailsSidebar({ setReviewModal }) {

  const [activeStatus, setActiveStatus] = useState("") // to keep track or section toggle
  const [videoBarActive, setVideoBarActive] = useState("") // to keep track of subsection bar color

  const navigate = useNavigate()
  const location = useLocation()
  const { sectionId, subSectionId } = useParams()
  // fetch data from slice
  const {
    courseSectionData,
    courseEntireData,
    totalNoOfLectures,
    completedLectures,
  } = useSelector((state) => state.viewCourse)

  useEffect(() => {
    ;(() => {
      if (!courseSectionData.length) return

      const currentSectionIndx = courseSectionData.findIndex((data) => data._id === sectionId)
      const currentSubSectionIndx = courseSectionData?.[currentSectionIndx]?.subSection.findIndex((data) => data._id === subSectionId)

      const activeSubSectionId = courseSectionData[currentSectionIndx]?.subSection?.[ currentSubSectionIndx ]?._id

      setActiveStatus(courseSectionData?.[currentSectionIndx]?._id)
      setVideoBarActive(activeSubSectionId)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSectionData, courseEntireData, location.pathname])

  return (
    <>
      <div className="flex h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800">
        <div className="mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25">
          
          {/* BACK and REVIEW BUTTON */}
          <div className="flex w-full items-center justify-between ">
            <div
              onClick={() => {
                navigate(`/dashboard/enrolled-courses`)
              }}
              className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90"
              title="back"  // BACK BUTTON
            >
              <IoIosArrowBack size={30} />
            </div>
            <IconBtn
              text="Add Review" // ADD REVIEW -> MODAL / POP UP
              customClasses="ml-auto"
              onclick={() => setReviewModal(true)} // true -> open MODAL / POPUP
            />
          </div>
          {/* COURSE NAME and COMPLETED VIDEO */}
          <div className="flex flex-col">
            <p>{courseEntireData?.courseName}</p>
            <p className="text-sm font-semibold text-richblack-500">{completedLectures?.length} / {totalNoOfLectures}</p>
          </div>
        </div>

        {/********************************************************  SECTION  *******************************************************/}
        <div className="h-[calc(100vh - 5rem)] overflow-y-auto">
          {courseSectionData.map((section, index) => (
            <div
              className="mt-2 cursor-pointer text-sm text-richblack-5"
              onClick={() => setActiveStatus(section?._id)}
              key={index}
            >
              {/* Section name */}
              <div className="flex flex-row justify-between bg-richblack-600 px-5 py-4">
                <div className="w-[70%] font-semibold">
                  {section?.sectionName}
                </div>
                <div className="flex items-center gap-3">
                {/* Dropdown arrow */}
                  <span className={`${ activeStatus === section?.sectionName ? "rotate-0" : "rotate-180" } transition-all duration-500`}>
                    <BsChevronDown />
                  </span>
                </div>
              </div>

              {/***********************************************  SUB SECTION **************************************************/}
              
              {/*  */}
              {activeStatus === section?._id && (
                <div className="transition-[height] duration-500 ease-in-out">
                  {section.subSection.map((video, i) => (
                    <div
                    // HIGHLIGHTING THE VIDEO BAR ( match videoBarActive with current video_id )
                      className={`flex gap-3  px-5 py-2 ${videoBarActive === video._id? "bg-yellow-200 font-semibold text-richblack-800": "hover:bg-richblack-900"}` }
                      key={i}
                      onClick={() => {
                        // view course at the below route
                        navigate(`/view-course/${courseEntireData?._id}/section/${section?._id}/sub-section/${video?._id}`)
                        setVideoBarActive(video._id)
                      }}
                      // COMPLETED LECTURE CHECKBOX
                    > <input
                        type="checkbox"
                        checked={completedLectures.includes(video?._id)} // check if 
                        onChange={() => {}} // nothing
                      />
                      {video.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
