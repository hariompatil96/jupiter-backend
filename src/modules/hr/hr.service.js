const Student = require('../student/student.model');
const Skill = require('../skill/skill.model');
const Performance = require('../performance/performance.model');
const Document = require('../document/document.model');
const {
  STUDENT_STATUS,
  SKILL_STATUS,
  PERFORMANCE_STATUS,
  DOCUMENT_STATUS,
} = require('../../utils/constants');

class HRService {
  /**
   * Get comprehensive dashboard statistics
   * @returns {Object} Dashboard statistics
   */
  async getDashboardStats() {
    // Student statistics
    const [
      totalStudents,
      activeStudents,
      inactiveStudents,
      graduatedStudents,
      suspendedStudents,
    ] = await Promise.all([
      Student.countDocuments(),
      Student.countDocuments({ status: STUDENT_STATUS.ACTIVE }),
      Student.countDocuments({ status: STUDENT_STATUS.INACTIVE }),
      Student.countDocuments({ status: STUDENT_STATUS.GRADUATED }),
      Student.countDocuments({ status: STUDENT_STATUS.SUSPENDED }),
    ]);

    // Skill statistics
    const [
      totalSkills,
      pendingSkills,
      verifiedSkills,
      rejectedSkills,
    ] = await Promise.all([
      Skill.countDocuments(),
      Skill.countDocuments({ status: SKILL_STATUS.PENDING }),
      Skill.countDocuments({ status: SKILL_STATUS.VERIFIED }),
      Skill.countDocuments({ status: SKILL_STATUS.REJECTED }),
    ]);

    // Performance statistics
    const [
      totalPerformances,
      pendingPerformances,
      approvedPerformances,
      rejectedPerformances,
    ] = await Promise.all([
      Performance.countDocuments(),
      Performance.countDocuments({ status: PERFORMANCE_STATUS.PENDING }),
      Performance.countDocuments({ status: PERFORMANCE_STATUS.APPROVED }),
      Performance.countDocuments({ status: PERFORMANCE_STATUS.REJECTED }),
    ]);

    // Document statistics
    const [
      totalDocuments,
      pendingDocuments,
      verifiedDocuments,
      rejectedDocuments,
    ] = await Promise.all([
      Document.countDocuments(),
      Document.countDocuments({ status: DOCUMENT_STATUS.PENDING }),
      Document.countDocuments({ status: DOCUMENT_STATUS.VERIFIED }),
      Document.countDocuments({ status: DOCUMENT_STATUS.REJECTED }),
    ]);

    // Department-wise student distribution
    const departmentStats = await Student.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const studentsByDepartment = {};
    departmentStats.forEach((item) => {
      studentsByDepartment[item._id] = item.count;
    });

    // Recent activities (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [
      recentStudents,
      recentSkills,
      recentPerformances,
      recentDocuments,
    ] = await Promise.all([
      Student.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      Skill.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      Performance.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      Document.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
    ]);

    // Skill category distribution
    const skillCategoryStats = await Skill.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const topSkillCategories = {};
    skillCategoryStats.forEach((item) => {
      topSkillCategories[item._id] = item.count;
    });

    // Performance type distribution
    const performanceTypeStats = await Performance.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const performanceByType = {};
    performanceTypeStats.forEach((item) => {
      performanceByType[item._id] = item.count;
    });

    // Document type distribution
    const documentTypeStats = await Document.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const documentsByType = {};
    documentTypeStats.forEach((item) => {
      documentsByType[item._id] = item.count;
    });

    return {
      students: {
        total: totalStudents,
        active: activeStudents,
        inactive: inactiveStudents,
        graduated: graduatedStudents,
        suspended: suspendedStudents,
        byDepartment: studentsByDepartment,
      },
      skills: {
        total: totalSkills,
        pending: pendingSkills,
        verified: verifiedSkills,
        rejected: rejectedSkills,
        topCategories: topSkillCategories,
      },
      performances: {
        total: totalPerformances,
        pending: pendingPerformances,
        approved: approvedPerformances,
        rejected: rejectedPerformances,
        byType: performanceByType,
      },
      documents: {
        total: totalDocuments,
        pending: pendingDocuments,
        verified: verifiedDocuments,
        rejected: rejectedDocuments,
        byType: documentsByType,
      },
      recentActivity: {
        newStudents: recentStudents,
        newSkills: recentSkills,
        newPerformances: recentPerformances,
        newDocuments: recentDocuments,
        period: '7 days',
      },
      pendingActions: {
        skillsToVerify: pendingSkills,
        performancesToReview: pendingPerformances,
        documentsToVerify: pendingDocuments,
        total: pendingSkills + pendingPerformances + pendingDocuments,
      },
    };
  }
}

module.exports = new HRService();
