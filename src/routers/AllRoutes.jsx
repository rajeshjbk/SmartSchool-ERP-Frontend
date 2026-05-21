import { Routes, Route } from "react-router-dom";
import { Home } from "../components/Home";
import { Login } from "../components/Login";
import { Registration } from "../components/Registration";

import { AdminDashboard } from "../components/AdminDashboard";
import { UsersCRUD } from "../pages/admin/UsersCRUD";
import { TeachersCRUD } from "../pages/admin/TeachersCRUD";
import { StudentsCRUD } from "../pages/admin/StudentsCRUD";
import { ClassesCRUD } from "../pages/admin/ClassesCRUD";
import { SubjectsCRUD } from "../pages/admin/SubjectsCRUD";
import { AttendanceCRUD } from "../pages/admin/AttendanceCRUD";
import { ExamsCRUD } from "../pages/admin/ExamsCRUD";
import { ExamSubjectsCRUD } from "../pages/admin/ExamSubjectsCRUD";
import { ResultsCRUD } from "../pages/admin/ResultsCRUD";
import { TimetableCRUD } from "../pages/admin/TimetableCRUD";
import { BooksCRUD } from "../pages/admin/BooksCRUD";
import { BookIssuesCRUD } from "../pages/admin/BookIssuesCRUD";
import { FeeStructureCRUD } from "../pages/admin/FeeStructureCRUD";
import { FeeTransactionsCRUD } from "../pages/admin/FeeTransactionsCRUD";
import { NoticesCRUD } from "../pages/admin/NoticesCRUD";
import { LeaveApplicationsCRUD } from "../pages/admin/LeaveApplicationsCRUD";
import { StudentDashboard } from "../components/StudentDashboard";
import { TeacherDashboard } from "../components/TeacherDashboard";
import { ParentDashboard } from "../components/ParentDashboard";
import { TeacherStudents } from "../pages/teacher/TeacherStudents";
import { TeacherAttendance } from "../pages/teacher/TeacherAttendance";
import { TeacherResults } from "../pages/teacher/TeacherResults";
import { TeacherTimetable } from "../pages/teacher/TeacherTimetable";
import { TeacherClasses } from "../pages/teacher/TeacherClasses";
import { TeacherSubjects } from "../pages/teacher/TeacherSubjects";
import { TeacherNotices } from "../pages/teacher/TeacherNotices";
import { TeacherExams } from "../pages/teacher/TeacherExams";
import { TeacherLibrary } from "../pages/teacher/TeacherLibrary";
import { TeacherLeave } from "../pages/teacher/TeacherLeave";
import { StudentProfile } from "../pages/student/StudentProfile";
import { StudentAttendance } from "../pages/student/StudentAttendance";
import { StudentResults } from "../pages/student/StudentResults";
import { StudentTimetable } from "../pages/student/StudentTimetable";
import { StudentSubjects } from "../pages/student/StudentSubjects";
import { StudentFees } from "../pages/student/StudentFees";
import { StudentNotices } from "../pages/student/StudentNotices";
import { StudentExams } from "../pages/student/StudentExams";
import { StudentLibrary } from "../pages/student/StudentLibrary";
import { StudentLeave } from "../pages/student/StudentLeave";
import { ParentChildProfile } from "../pages/parent/ParentChildProfile";
import { ParentAttendance } from "../pages/parent/ParentAttendance";
import { ParentResults } from "../pages/parent/ParentResults";
import { ParentTimetable } from "../pages/parent/ParentTimetable";
import { ParentNotices } from "../pages/parent/ParentNotices";
import { ParentFees } from "../pages/parent/ParentFees";
import { ParentExams } from "../pages/parent/ParentExams";
import { ParentLibrary } from "../pages/parent/ParentLibrary";
import { ParentLeave } from "../pages/parent/ParentLeave";
import { ProtectedRoute } from "./ProtectedRoute";

export function AllRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRole="ROLE_ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="users-crud" element={<UsersCRUD />} />
          <Route path="teachers-crud" element={<TeachersCRUD />} />
          <Route path="students-crud" element={<StudentsCRUD />} />
          <Route path="classes-crud" element={<ClassesCRUD />} />
          <Route path="subjects-crud" element={<SubjectsCRUD />} />
          <Route path="attendance-crud" element={<AttendanceCRUD />} />
          <Route path="exams-crud" element={<ExamsCRUD />} />
          <Route path="exam-subjects-crud" element={<ExamSubjectsCRUD />} />
          <Route path="results-crud" element={<ResultsCRUD />} />
          <Route path="timetable-crud" element={<TimetableCRUD />} />
          <Route path="books-crud" element={<BooksCRUD />} />
          <Route path="book-issues-crud" element={<BookIssuesCRUD />} />
          <Route path="fee-structure-crud" element={<FeeStructureCRUD />} />
          <Route
            path="fee-transactions-crud"
            element={<FeeTransactionsCRUD />}
          />
          <Route path="notices-crud" element={<NoticesCRUD />} />
          <Route
            path="leave-applications-crud"
            element={<LeaveApplicationsCRUD />}
          />
        </Route>
        //Teacher Dashboard Routes
        <Route
          path="/teacher-dashboard"
          element={
            <ProtectedRoute allowedRole="ROLE_TEACHER">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="teacher/student" element={<TeacherStudents />} />
          <Route path="teacher/attendance" element={<TeacherAttendance />} />
          <Route path="teacher/results" element={<TeacherResults />} />
          <Route path="teacher/timetable" element={<TeacherTimetable />} />
          <Route path="teacher/classes" element={<TeacherClasses />} />
          <Route path="teacher/subjects" element={<TeacherSubjects />} />
          <Route path="teacher/notices" element={<TeacherNotices />} />
          <Route path="teacher/exams" element={<TeacherExams />} />
          <Route path="teacher/library" element={<TeacherLibrary />} />
          <Route path="teacher/leave" element={<TeacherLeave />} />
        </Route>
        //Student Dashboard Routes
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute allowedRole="ROLE_STUDENT">
              <StudentDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="student/profile" element={<StudentProfile />} />
          <Route path="student/attendance" element={<StudentAttendance />} />
          <Route path="student/results" element={<StudentResults />} />
          <Route path="student/timetable" element={<StudentTimetable />} />
          <Route path="student/subjects" element={<StudentSubjects />} />
          <Route path="student/fees" element={<StudentFees />} />
          <Route path="student/notices" element={<StudentNotices />} />
          <Route path="student/exams" element={<StudentExams />} />
          <Route path="student/library" element={<StudentLibrary />} />
          <Route path="student/leave" element={<StudentLeave />} />
        </Route>
        // Parent Dashboard Routes
        <Route
          path="/parent-dashboard"
          element={
            <ProtectedRoute allowedRole="ROLE_PARENT">
              <ParentDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="parent/student" element={<ParentChildProfile />} />
          <Route path="parent/attendance" element={<ParentAttendance />} />
          <Route path="parent/results" element={<ParentResults />} />
          <Route path="parent/timetable" element={<ParentTimetable />} />
          <Route path="parent/fees" element={<ParentFees />} />
          <Route path="parent/notices" element={<ParentNotices />} />
          <Route path="parent/exams" element={<ParentExams />} />
          <Route path="parent/library" element={<ParentLibrary />} />
          <Route path="parent/leave" element={<ParentLeave />} />
        </Route>
      </Routes>
    </>
  );
}
