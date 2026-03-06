-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('MENTOR', 'UNIVERSITY_ADMIN', 'UNIVERSITY_SUPERVISOR', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "WorkspaceStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "DeliveryMethod" AS ENUM ('FACE_TO_FACE', 'ONLINE');

-- CreateEnum
CREATE TYPE "MeetingType" AS ENUM ('INDIVIDUAL', 'GROUP');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'REVISION', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'MENTOR',
    "status" "UserStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "universityId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,
    "activeWorkspaceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workspace" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "WorkspaceStatus" NOT NULL DEFAULT 'ACTIVE',
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserWorkspace" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,

    CONSTRAINT "UserWorkspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "University" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "province" TEXT,
    "workspaceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "University_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participant" (
    "id" TEXT NOT NULL,
    "tkmId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "registrantNationalId" TEXT,
    "birthPlace" TEXT,
    "lastEducation" TEXT,
    "currentActivity" TEXT,
    "isDisabled" BOOLEAN NOT NULL DEFAULT false,
    "disabilityType" TEXT,
    "registrationDate" TIMESTAMP(3),
    "whatsapp" TEXT,
    "socialPlatform" TEXT,
    "socialAccount" TEXT,
    "socialLink" TEXT,
    "relativeName1" TEXT,
    "relativePhone1" TEXT,
    "relativeStatus1" TEXT,
    "relativeName2" TEXT,
    "relativePhone2" TEXT,
    "relativeStatus2" TEXT,
    "businessName" TEXT,
    "businessSector" TEXT,
    "businessType" TEXT,
    "businessDesc" TEXT,
    "mainProduct" TEXT,
    "businessLocation" TEXT,
    "locationOwnership" TEXT,
    "sameAsResidence" BOOLEAN DEFAULT false,
    "businessAddress" TEXT,
    "businessProvince" TEXT,
    "businessCity" TEXT,
    "businessDistrict" TEXT,
    "businessSubDistrict" TEXT,
    "businessPostalCode" TEXT,
    "salesChannel" TEXT,
    "marketingArea" TEXT,
    "marketingCountry" TEXT,
    "businessPartner" TEXT,
    "partnerCount" INTEGER,
    "revenuePerPeriod" DECIMAL(18,2),
    "profitPerPeriod" DECIMAL(18,2),
    "productCountPerPeriod" DOUBLE PRECISION,
    "productUnitPerPeriod" TEXT,
    "idCardUrl" TEXT,
    "familyCardUrl" TEXT,
    "selfPhotoUrl" TEXT,
    "assistanceLetterUrl" TEXT,
    "commitmentLetterUrl" TEXT,
    "businessProfileDocUrl" TEXT,
    "bmcStrategyDocUrl" TEXT,
    "budgetPlanUrl" TEXT,
    "developmentPlanUrl" TEXT,
    "businessVideoUrl" TEXT,
    "businessPhotoUrl" TEXT,
    "financialRecordUrl" TEXT,
    "communicationStatus" TEXT,
    "fundDisbursementStatus" TEXT,
    "presenceStatus" TEXT,
    "isWillingToBeAssisted" BOOLEAN,
    "unwillingReason" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "dropReason" TEXT,
    "googleMapsUrl" TEXT,
    "bmcUrl" TEXT,
    "actionPlanUrl" TEXT,
    "workspaceId" TEXT NOT NULL,
    "universityId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParticipantAssignment" (
    "id" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ParticipantAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Logbook" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "deliveryMethod" "DeliveryMethod" NOT NULL,
    "meetingType" "MeetingType" NOT NULL,
    "visitType" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "studyHours" INTEGER NOT NULL DEFAULT 0,
    "material" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "obstacle" TEXT NOT NULL,
    "solution" TEXT NOT NULL,
    "totalExpense" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "documentationUrls" TEXT[],
    "expenseProofUrl" TEXT,
    "noExpenseReason" TEXT,
    "reviewStatus" "ReviewStatus" NOT NULL DEFAULT 'DRAFT',
    "mentorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Logbook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogbookParticipant" (
    "id" TEXT NOT NULL,
    "logbookId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,

    CONSTRAINT "LogbookParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogbookReview" (
    "id" TEXT NOT NULL,
    "logbookId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "action" "ReviewStatus" NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LogbookReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Output" (
    "id" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "reportMonth" TIMESTAMP(3) NOT NULL,
    "revenue" DECIMAL(18,2) NOT NULL,
    "salesVolume" DOUBLE PRECISION NOT NULL,
    "salesVolumeUnit" TEXT NOT NULL,
    "productionCapacity" DOUBLE PRECISION NOT NULL,
    "productionCapacityUnit" TEXT NOT NULL,
    "workerConfirmation" TEXT NOT NULL,
    "incomeProofUrl" TEXT NOT NULL,
    "cashflowProofUrl" TEXT NOT NULL,
    "obstacle" TEXT NOT NULL,
    "marketingArea" TEXT NOT NULL,
    "businessCondition" TEXT NOT NULL,
    "lpjUrl" TEXT NOT NULL,
    "hasCashflowBookkeeping" BOOLEAN NOT NULL,
    "hasIncomeStatementBookkeeping" BOOLEAN NOT NULL,
    "reviewStatus" "ReviewStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Output_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "outputId" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "idCardUrl" TEXT NOT NULL,
    "employmentStatus" TEXT NOT NULL,
    "hasBpjs" BOOLEAN NOT NULL,
    "isDisabled" BOOLEAN NOT NULL,
    "disabilityType" TEXT,
    "gender" TEXT NOT NULL,
    "bpjsType" TEXT,
    "bpjsNumber" TEXT,
    "bpjsCardUrl" TEXT,
    "role" TEXT NOT NULL,
    "salarySlipUrl" TEXT NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutputReview" (
    "id" TEXT NOT NULL,
    "outputId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "action" "ReviewStatus" NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OutputReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupervisorNote" (
    "id" TEXT NOT NULL,
    "supervisorId" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupervisorNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "UserWorkspace_userId_workspaceId_key" ON "UserWorkspace"("userId", "workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "University_code_key" ON "University"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_tkmId_key" ON "Participant"("tkmId");

-- CreateIndex
CREATE UNIQUE INDEX "ParticipantAssignment_participantId_mentorId_key" ON "ParticipantAssignment"("participantId", "mentorId");

-- CreateIndex
CREATE UNIQUE INDEX "LogbookParticipant_logbookId_participantId_key" ON "LogbookParticipant"("logbookId", "participantId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWorkspace" ADD CONSTRAINT "UserWorkspace_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWorkspace" ADD CONSTRAINT "UserWorkspace_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "University" ADD CONSTRAINT "University_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantAssignment" ADD CONSTRAINT "ParticipantAssignment_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantAssignment" ADD CONSTRAINT "ParticipantAssignment_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Logbook" ADD CONSTRAINT "Logbook_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogbookParticipant" ADD CONSTRAINT "LogbookParticipant_logbookId_fkey" FOREIGN KEY ("logbookId") REFERENCES "Logbook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogbookParticipant" ADD CONSTRAINT "LogbookParticipant_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogbookReview" ADD CONSTRAINT "LogbookReview_logbookId_fkey" FOREIGN KEY ("logbookId") REFERENCES "Logbook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogbookReview" ADD CONSTRAINT "LogbookReview_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Output" ADD CONSTRAINT "Output_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_outputId_fkey" FOREIGN KEY ("outputId") REFERENCES "Output"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutputReview" ADD CONSTRAINT "OutputReview_outputId_fkey" FOREIGN KEY ("outputId") REFERENCES "Output"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutputReview" ADD CONSTRAINT "OutputReview_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupervisorNote" ADD CONSTRAINT "SupervisorNote_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
