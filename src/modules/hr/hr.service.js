const Student = require('../student/student.model');
const Skill = require('../skill/skill.model');
const Performance = require('../performance/performance.model');
const Document = require('../document/document.model');
const {
  STUDENT_STATUS,
  PERFORMANCE_STATUS,
  DOCUMENT_STATUS,
} = require('../../utils/constants');

class HRService {
  /**
   * Get comprehensive dashboard statistics (aligned with Java)
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
      onLeaveStudents,
    ] = await Promise.all([
      Student.countDocuments(),
      Student.countDocuments({ status: STUDENT_STATUS.ACTIVE }),
      Student.countDocuments({ status: STUDENT_STATUS.INACTIVE }),
      Student.countDocuments({ status: STUDENT_STATUS.GRADUATED }),
      Student.countDocuments({ status: STUDENT_STATUS.SUSPENDED }),
      Student.countDocuments({ status: STUDENT_STATUS.ON_LEAVE }),
    ]);

    // Skill statistics (using verifiedByHr boolean - aligned with Java)
    const [
      totalSkills,
      unverifiedSkills,
      verifiedSkills,
    ] = await Promise.all([
      Skill.countDocuments(),
      Skill.countDocuments({ verifiedByHr: false }),
      Skill.countDocuments({ verifiedByHr: true }),
    ]);

    // Performance statistics
    const [
      totalPerformances,
      draftPerformances,
      pendingPerformances,
      approvedPerformances,
      rejectedPerformances,
    ] = await Promise.all([
      Performance.countDocuments(),
      Performance.countDocuments({ status: PERFORMANCE_STATUS.DRAFT }),
      Performance.countDocuments({ status: PERFORMANCE_STATUS.PENDING }),
      Performance.countDocuments({ status: PERFORMANCE_STATUS.APPROVED }),
      Performance.countDocuments({ status: PERFORMANCE_STATUS.REJECTED }),
    ]);

    // Document statistics
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const [
      totalDocuments,
      pendingDocuments,
      verifiedDocuments,
      rejectedDocuments,
      expiringDocuments,
    ] = await Promise.all([
      Document.countDocuments(),
      Document.countDocuments({ status: DOCUMENT_STATUS.PENDING }),
      Document.countDocuments({ status: DOCUMENT_STATUS.VERIFIED }),
      Document.countDocuments({ status: DOCUMENT_STATUS.REJECTED }),
      Document.countDocuments({
        expiryDate: { $gt: now, $lte: thirtyDaysFromNow },
      }),
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

    // Performance type distribution (using evaluationType - aligned with Java)
    const performanceTypeStats = await Performance.aggregate([
      { $group: { _id: '$evaluationType', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const performanceByType = {};
    performanceTypeStats.forEach((item) => {
      performanceByType[item._id] = item.count;
    });

    // Document type distribution (using documentType - aligned with Java)
    const documentTypeStats = await Document.aggregate([
      { $group: { _id: '$documentType', count: { $sum: 1 } } },
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
        onLeave: onLeaveStudents,
        byDepartment: studentsByDepartment,
      },
      skills: {
        total: totalSkills,
        unverified: unverifiedSkills,
        verified: verifiedSkills,
        topCategories: topSkillCategories,
      },
      performances: {
        total: totalPerformances,
        draft: draftPerformances,
        pending: pendingPerformances,
        approved: approvedPerformances,
        rejected: rejectedPerformances,
        byEvaluationType: performanceByType,
      },
      documents: {
        total: totalDocuments,
        pending: pendingDocuments,
        verified: verifiedDocuments,
        rejected: rejectedDocuments,
        expiringSoon: expiringDocuments,
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
        skillsToVerify: unverifiedSkills,
        performancesToReview: pendingPerformances,
        documentsToVerify: pendingDocuments,
        expiringDocuments: expiringDocuments,
        total: unverifiedSkills + pendingPerformances + pendingDocuments,
      },
    };
  }
}

module.exports = new HRService();
