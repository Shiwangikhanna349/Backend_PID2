import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import VideoModal from "../components/VideoModal";

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});
  const [videoModal, setVideoModal] = useState({
    isOpen: false,
    videoId: "",
    title: "",
    description: "",
  });

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      console.log("Fetching course with ID:", id);
      const response = await axios.get(
        `http://localhost:5002/api/courses/${id}`
      );
      console.log("Course data received:", response.data);
      setCourse(response.data);
    } catch (error) {
      console.error("Error fetching course:", error);

      setCourse(null);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (sectionIndex) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionIndex]: !prev[sectionIndex],
    }));
  };

  const openVideoModal = (videoId, title, description) => {
    setVideoModal({
      isOpen: true,
      videoId,
      title,
      description,
    });
  };

  const closeVideoModal = () => {
    setVideoModal({
      isOpen: false,
      videoId: "",
      title: "",
      description: "",
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400" : "text-gray-300"
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Course not found!</strong>
            <p className="mt-2">
              The course with ID "{id}" could not be found.
            </p>
            <p className="mt-1">Please check the URL or try again later.</p>
          </div>
          <a
            href="/courses"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Browse All Courses
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="gradient-bg py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {course.title}
              </h1>
              <p className="text-xl text-gray-600 mb-4">{course.subtitle}</p>
              <p className="text-gray-600 mb-6">{course.description}</p>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {renderStars(course.rating)}
                  <span className="text-sm text-gray-600 ml-2">
                    ({course.reviewCount} ratings) {course.studentCount}{" "}
                    students
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden sticky top-8">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <svg
                      className="w-5 h-5 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-red-600 font-semibold">
                      5 days left at this price!
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-3xl font-bold text-gray-900">
                      ${course.price}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      ${course.originalPrice}
                    </span>
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                      20% off
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-semibold text-gray-900">
                          {course.rating} ★
                        </div>
                        <div className="text-sm text-gray-600">Rating</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-gray-900">
                          {course.duration}
                        </div>
                        <div className="text-sm text-gray-600">Duration</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-gray-900">
                          {course.lessons} lessons
                        </div>
                        <div className="text-sm text-gray-600">Lessons</div>
                      </div>
                    </div>
                  </div>

                  <button className="btn-primary w-full text-lg py-3">
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                  Course Structure
                </h2>
                {course.syllabus?.map((section, index) => (
                  <div key={index} className="mb-4">
                    <button
                      onClick={() => toggleSection(index)}
                      className="w-full text-left bg-gray-50 rounded-lg p-4 flex justify-between items-center hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {section.section}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {section.lectures.length} lectures -{" "}
                          {section.lectures.reduce((total, lecture) => {
                            const hours = parseFloat(lecture.duration);
                            return total + hours;
                          }, 0)}{" "}
                          hours
                        </p>
                      </div>
                      <svg
                        className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
                          expandedSections[index] ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {expandedSections[index] && (
                      <div className="mt-2 bg-white border border-gray-200 rounded-lg p-4">
                        <ul className="space-y-2">
                          {section.lectures.map((lecture, lectureIndex) => (
                            <li
                              key={lectureIndex}
                              className="flex items-center justify-between py-2"
                            >
                              <button
                                onClick={() =>
                                  lecture.videoId &&
                                  openVideoModal(
                                    lecture.videoId,
                                    lecture.title,
                                    lecture.description
                                  )
                                }
                                className={`flex items-center flex-1 text-left hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200 ${
                                  lecture.videoId
                                    ? "cursor-pointer"
                                    : "cursor-default"
                                }`}
                                disabled={!lecture.videoId}
                              >
                                <svg
                                  className="w-4 h-4 text-blue-600 mr-3"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <div className="flex-1">
                                  <span
                                    className={`text-gray-900 ${
                                      lecture.videoId
                                        ? "hover:text-blue-600"
                                        : ""
                                    }`}
                                  >
                                    {lecture.title}
                                  </span>
                                  {lecture.videoId && (
                                    <div className="flex items-center mt-1">
                                      <svg
                                        className="w-3 h-3 text-red-500 mr-1"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                      <span className="text-xs text-red-500 font-medium">
                                        Watch Video
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </button>
                              <span className="text-sm text-gray-600 ml-4">
                                {lecture.duration}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Course Description
                </h2>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {course.subtitle}
                </h3>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <p className="text-gray-600">
                  By the end of this course, you will understand cloud services,
                  deployment models, and best practices for using cloud
                  resources efficiently.
                </p>
              </div>

              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                  What you'll learn
                </h2>
                <ul className="space-y-3">
                  {course.learningOutcomes?.map((outcome, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-green-500 mr-3 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                  Requirements
                </h2>
                <ul className="space-y-3">
                  {course.requirements?.map((requirement, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-blue-500 mr-3 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  What's in the course?
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mr-3 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">
                      Lifetime access with free updates.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mr-3 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">
                      Step-by-step, hands-on project guidance.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mr-3 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">
                      Downloadable resources and source code.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mr-3 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">
                      Quizzes to test your knowledge.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mr-3 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">
                      Certificate of completion.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <VideoModal
        isOpen={videoModal.isOpen}
        onClose={closeVideoModal}
        videoId={videoModal.videoId}
        title={videoModal.title}
        description={videoModal.description}
      />
    </div>
  );
};

export default CourseDetail;
