import { useState, useCallback } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
}

interface WorkExperience {
  id: string;
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  id: string;
  degree: string;
  school: string;
  startYear: string;
  endYear: string;
  gpa: string;
}

interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: string[];
}

type Template = "modern" | "classic" | "minimal" | "creative";

const defaultPersonalInfo: PersonalInfo = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  website: "",
};

const defaultExperience: WorkExperience = {
  id: "exp-1",
  jobTitle: "",
  company: "",
  startDate: "",
  endDate: "",
  description: "",
};

const defaultEducation: Education = {
  id: "edu-1",
  degree: "",
  school: "",
  startYear: "",
  endYear: "",
  gpa: "",
};

const templates: { value: Template; label: string; description: string }[] = [
  { value: "modern", label: "Modern", description: "Clean lines, blue accent" },
  { value: "classic", label: "Classic", description: "Traditional, professional" },
  { value: "minimal", label: "Minimal", description: "Simple, elegant" },
  { value: "creative", label: "Creative", description: "Bold, unique layout" },
];

export default function ResumeBuilderTool() {
  const [activeTab, setActiveTab] = useState<"form" | "preview">("form");
  const [template, setTemplate] = useState<Template>("modern");
  const [generating, setGenerating] = useState(false);

  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: defaultPersonalInfo,
    summary: "",
    experience: [{ ...defaultExperience }],
    education: [{ ...defaultEducation }],
    skills: [],
  });

  const [skillInput, setSkillInput] = useState("");

  const updatePersonalInfo = useCallback((field: keyof PersonalInfo, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  }, []);

  const updateSummary = useCallback((value: string) => {
    setResumeData((prev) => ({ ...prev, summary: value }));
  }, []);

  const addExperience = useCallback(() => {
    setResumeData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { ...defaultExperience, id: `exp-${Date.now()}` },
      ],
    }));
  }, []);

  const removeExperience = useCallback((id: string) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter((e) => e.id !== id),
    }));
  }, []);

  const updateExperience = useCallback((id: string, field: keyof WorkExperience, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((e) =>
        e.id === id ? { ...e, [field]: value } : e
      ),
    }));
  }, []);

  const addEducation = useCallback(() => {
    setResumeData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { ...defaultEducation, id: `edu-${Date.now()}` },
      ],
    }));
  }, []);

  const removeEducation = useCallback((id: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((e) => e.id !== id),
    }));
  }, []);

  const updateEducation = useCallback((id: string, field: keyof Education, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((e) =>
        e.id === id ? { ...e, [field]: value } : e
      ),
    }));
  }, []);

  const addSkill = useCallback(() => {
    const skill = skillInput.trim();
    if (skill && !resumeData.skills.includes(skill)) {
      setResumeData((prev) => ({ ...prev, skills: [...prev.skills, skill] }));
      setSkillInput("");
    }
  }, [skillInput, resumeData.skills]);

  const removeSkill = useCallback((skill: string) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  }, []);

  const handleSkillKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addSkill();
      }
    },
    [addSkill]
  );

  const generatePDF = useCallback(async () => {
    setGenerating(true);
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([612, 792]);

      const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const timesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

      const isModern = template === "modern";
      const isClassic = template === "classic";
      const isCreative = template === "creative";
      const isMinimal = template === "minimal";

      const titleFont = isClassic || isCreative ? timesRomanBold : helveticaBold;
      const bodyFont = isClassic || isCreative ? timesRoman : helvetica;
      const boldFont = isClassic || isCreative ? timesRomanBold : helveticaBold;

      let y = 740;
      const leftMargin = 50;
      const rightMargin = 562;
      const maxWidth = rightMargin - leftMargin;

      const drawLine = (yPos: number, color: [number, number, number] = isModern ? [59, 130, 246] : isCreative ? [139, 92, 246] : [100, 100, 100]) => {
        page.drawLine({
          start: { x: leftMargin, y: yPos },
          end: { x: rightMargin, y: yPos },
          thickness: isMinimal ? 0.5 : 1,
          color: rgb(color[0] / 255, color[1] / 255, color[2] / 255),
        });
      };

      const drawText = (text: string, x: number, yPos: number, font: typeof helvetica, size: number, color?: [number, number, number]) => {
        page.drawText(text, {
          x,
          y: yPos,
          size,
          font,
          color: color
            ? rgb(color[0] / 255, color[1] / 255, color[2] / 255)
            : rgb(0.1, 0.1, 0.1),
        });
      };

      const wrapText = (text: string, font: typeof helvetica, size: number, maxWidth: number): string[] => {
        const words = text.split(" ");
        const lines: string[] = [];
        let currentLine = "";

        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          const testWidth = font.widthOfTextAtSize(testLine, size);
          if (testWidth > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }
        if (currentLine) lines.push(currentLine);
        return lines.length > 0 ? lines : [""];
      };

      const drawSection = (title: string) => {
        if (isModern) {
          drawText(title.toUpperCase(), leftMargin, y, helveticaBold, 11, [59, 130, 246]);
          y -= 4;
          drawLine(y, [59, 130, 246]);
        } else if (isCreative) {
          drawText(title.toUpperCase(), leftMargin, y, timesRomanBold, 11, [139, 92, 246]);
          y -= 4;
          drawLine(y, [139, 92, 246]);
        } else if (isMinimal) {
          drawText(title.toLowerCase(), leftMargin, y, helvetica, 9, [150, 150, 150]);
          y -= 4;
          drawLine(y, [200, 200, 200]);
        } else {
          drawText(title, leftMargin, y, timesRomanBold, 11, [40, 40, 40]);
          y -= 4;
          drawLine(y, [40, 40, 40]);
        }
        y -= 14;
      };

      // Header
      if (resumeData.personalInfo.fullName) {
        const nameSize = isCreative ? 22 : 20;
        drawText(resumeData.personalInfo.fullName.toUpperCase(), leftMargin, y, titleFont, nameSize);
        y -= 28;
      }

      // Contact info
      const contactParts: string[] = [];
      if (resumeData.personalInfo.email) contactParts.push(resumeData.personalInfo.email);
      if (resumeData.personalInfo.phone) contactParts.push(resumeData.personalInfo.phone);
      if (resumeData.personalInfo.location) contactParts.push(resumeData.personalInfo.location);

      if (contactParts.length > 0) {
        const separator = isModern ? " | " : " • ";
        const contactText = contactParts.join(separator);
        const lines = wrapText(contactText, bodyFont, 9, maxWidth);
        for (const line of lines) {
          drawText(line, leftMargin, y, bodyFont, 9, [120, 120, 120]);
          y -= 12;
        }
      }

      const socialParts: string[] = [];
      if (resumeData.personalInfo.linkedin) socialParts.push(resumeData.personalInfo.linkedin);
      if (resumeData.personalInfo.website) socialParts.push(resumeData.personalInfo.website);

      if (socialParts.length > 0) {
        const separator = isModern ? " | " : " • ";
        const socialText = socialParts.join(separator);
        const lines = wrapText(socialText, bodyFont, 9, maxWidth);
        for (const line of lines) {
          drawText(line, leftMargin, y, bodyFont, 9, [120, 120, 120]);
          y -= 12;
        }
      }

      y -= 8;

      // Summary
      if (resumeData.summary.trim()) {
        drawSection("Professional Summary");
        const lines = wrapText(resumeData.summary, bodyFont, 10, maxWidth);
        for (const line of lines) {
          drawText(line, leftMargin, y, bodyFont, 10, [60, 60, 60]);
          y -= 14;
        }
        y -= 6;
      }

      // Experience
      const validExperience = resumeData.experience.filter(
        (e) => e.jobTitle.trim() || e.company.trim()
      );
      if (validExperience.length > 0) {
        drawSection("Work Experience");
        for (const exp of validExperience) {
          if (exp.jobTitle) {
            drawText(exp.jobTitle, leftMargin, y, boldFont, 10);
          }
          const dateRange = [exp.startDate, exp.endDate || "Present"]
            .filter(Boolean)
            .join(" - ");
          if (dateRange) {
            const dateWidth = titleFont.widthOfTextAtSize(dateRange, 9);
            drawText(dateRange, rightMargin - dateWidth, y, bodyFont, 9, [120, 120, 120]);
          }
          y -= 13;

          if (exp.company) {
            drawText(exp.company, leftMargin, y, bodyFont, 10, [80, 80, 80]);
            y -= 13;
          }

          if (exp.description) {
            const descLines = wrapText(exp.description, bodyFont, 9, maxWidth - 10);
            for (const line of descLines) {
              drawText(line, leftMargin + 10, y, bodyFont, 9, [60, 60, 60]);
              y -= 12;
            }
          }
          y -= 8;
        }
      }

      // Education
      const validEducation = resumeData.education.filter(
        (e) => e.degree.trim() || e.school.trim()
      );
      if (validEducation.length > 0) {
        drawSection("Education");
        for (const edu of validEducation) {
          if (edu.degree) {
            drawText(edu.degree, leftMargin, y, boldFont, 10);
          }
          const yearRange = [edu.startYear, edu.endYear]
            .filter(Boolean)
            .join(" - ");
          if (yearRange) {
            const yearWidth = titleFont.widthOfTextAtSize(yearRange, 9);
            drawText(yearRange, rightMargin - yearWidth, y, bodyFont, 9, [120, 120, 120]);
          }
          y -= 13;

          if (edu.school) {
            drawText(edu.school, leftMargin, y, bodyFont, 10, [80, 80, 80]);
            y -= 13;
          }

          if (edu.gpa) {
            drawText(`GPA: ${edu.gpa}`, leftMargin + 10, y, bodyFont, 9, [100, 100, 100]);
            y -= 13;
          }
          y -= 4;
        }
      }

      // Skills
      if (resumeData.skills.length > 0) {
        drawSection("Skills");
        const skillsText = resumeData.skills.join(isModern ? " • " : isCreative ? " | " : ", ");
        const lines = wrapText(skillsText, bodyFont, 10, maxWidth);
        for (const line of lines) {
          drawText(line, leftMargin, y, bodyFont, 10, [60, 60, 60]);
          y -= 14;
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "resume.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setGenerating(false);
    }
  }, [resumeData, template]);

  const inputClass =
    "w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]";

  const textareaClass = `${inputClass} resize-none`;

  return (
    <div className="space-y-6">
      {/* Template Selector */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4">
        <label className="mb-3 block text-sm font-semibold text-[var(--color-foreground)]">
          Resume Template
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {templates.map((t) => (
            <button
              key={t.value}
              onClick={() => setTemplate(t.value)}
              className={`rounded-lg border-2 px-3 py-2.5 text-left transition-all cursor-pointer ${
                template === t.value
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
                  : "border-[var(--color-border)] hover:border-[var(--color-primary)]/30"
              }`}
            >
              <span className="block text-sm font-semibold text-[var(--color-foreground)]">
                {t.label}
              </span>
              <span className="block text-xs text-[var(--color-muted-foreground)]">
                {t.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="flex rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)] p-1 sm:hidden">
        <button
          onClick={() => setActiveTab("form")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold transition-colors cursor-pointer ${
            activeTab === "form"
              ? "bg-[var(--color-card)] text-[var(--color-foreground)] shadow-sm"
              : "text-[var(--color-muted-foreground)]"
          }`}
        >
          Edit
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold transition-colors cursor-pointer ${
            activeTab === "preview"
              ? "bg-[var(--color-card)] text-[var(--color-foreground)] shadow-sm"
              : "text-[var(--color-muted-foreground)]"
          }`}
        >
          Preview
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <div className={`space-y-4 ${activeTab !== "form" ? "hidden sm:block" : ""}`}>
          {/* Personal Info */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4">
            <h3 className="mb-3 text-sm font-semibold text-[var(--color-foreground)]">
              Personal Information
            </h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--color-muted-foreground)]">
                  Full Name
                </label>
                <input
                  type="text"
                  value={resumeData.personalInfo.fullName}
                  onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
                  placeholder="John Doe"
                  className={inputClass}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-[var(--color-muted-foreground)]">
                    Email
                  </label>
                  <input
                    type="email"
                    value={resumeData.personalInfo.email}
                    onChange={(e) => updatePersonalInfo("email", e.target.value)}
                    placeholder="john@example.com"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-[var(--color-muted-foreground)]">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={resumeData.personalInfo.phone}
                    onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                    placeholder="(555) 123-4567"
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--color-muted-foreground)]">
                  Location
                </label>
                <input
                  type="text"
                  value={resumeData.personalInfo.location}
                  onChange={(e) => updatePersonalInfo("location", e.target.value)}
                  placeholder="New York, NY"
                  className={inputClass}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-[var(--color-muted-foreground)]">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={resumeData.personalInfo.linkedin}
                    onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
                    placeholder="linkedin.com/in/johndoe"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-[var(--color-muted-foreground)]">
                    Website / Portfolio
                  </label>
                  <input
                    type="url"
                    value={resumeData.personalInfo.website}
                    onChange={(e) => updatePersonalInfo("website", e.target.value)}
                    placeholder="johndoe.com"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4">
            <h3 className="mb-3 text-sm font-semibold text-[var(--color-foreground)]">
              Professional Summary
            </h3>
            <textarea
              value={resumeData.summary}
              onChange={(e) => updateSummary(e.target.value)}
              placeholder="Write 3-4 sentences about your professional background, key achievements, and career goals..."
              rows={4}
              className={textareaClass}
            />
          </div>

          {/* Work Experience */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[var(--color-foreground)]">
                Work Experience
              </h3>
              <button
                onClick={addExperience}
                className="rounded-lg bg-[var(--color-primary)] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:opacity-90 cursor-pointer"
              >
                + Add
              </button>
            </div>
            <div className="space-y-4">
              {resumeData.experience.map((exp, index) => (
                <div
                  key={exp.id}
                  className="rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)] p-3"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-[var(--color-muted-foreground)]">
                      Position {index + 1}
                    </span>
                    {resumeData.experience.length > 1 && (
                      <button
                        onClick={() => removeExperience(exp.id)}
                        className="text-xs font-semibold text-[var(--color-destructive)] hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-[var(--color-muted-foreground)]">
                          Job Title
                        </label>
                        <input
                          type="text"
                          value={exp.jobTitle}
                          onChange={(e) => updateExperience(exp.id, "jobTitle", e.target.value)}
                          placeholder="Software Engineer"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-[var(--color-muted-foreground)]">
                          Company
                        </label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                          placeholder="Acme Corp"
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-[var(--color-muted-foreground)]">
                          Start Date
                        </label>
                        <input
                          type="text"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                          placeholder="Jan 2020"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-[var(--color-muted-foreground)]">
                          End Date
                        </label>
                        <input
                          type="text"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                          placeholder="Present"
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-[var(--color-muted-foreground)]">
                        Description
                      </label>
                      <textarea
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                        placeholder="Describe your responsibilities and achievements..."
                        rows={3}
                        className={textareaClass}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[var(--color-foreground)]">
                Education
              </h3>
              <button
                onClick={addEducation}
                className="rounded-lg bg-[var(--color-primary)] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:opacity-90 cursor-pointer"
              >
                + Add
              </button>
            </div>
            <div className="space-y-4">
              {resumeData.education.map((edu, index) => (
                <div
                  key={edu.id}
                  className="rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)] p-3"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-[var(--color-muted-foreground)]">
                      Education {index + 1}
                    </span>
                    {resumeData.education.length > 1 && (
                      <button
                        onClick={() => removeEducation(edu.id)}
                        className="text-xs font-semibold text-[var(--color-destructive)] hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-[var(--color-muted-foreground)]">
                          Degree
                        </label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                          placeholder="B.S. Computer Science"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-[var(--color-muted-foreground)]">
                          School
                        </label>
                        <input
                          type="text"
                          value={edu.school}
                          onChange={(e) => updateEducation(edu.id, "school", e.target.value)}
                          placeholder="MIT"
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-[var(--color-muted-foreground)]">
                          Start Year
                        </label>
                        <input
                          type="text"
                          value={edu.startYear}
                          onChange={(e) => updateEducation(edu.id, "startYear", e.target.value)}
                          placeholder="2016"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-[var(--color-muted-foreground)]">
                          End Year
                        </label>
                        <input
                          type="text"
                          value={edu.endYear}
                          onChange={(e) => updateEducation(edu.id, "endYear", e.target.value)}
                          placeholder="2020"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-[var(--color-muted-foreground)]">
                          GPA (optional)
                        </label>
                        <input
                          type="text"
                          value={edu.gpa}
                          onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)}
                          placeholder="3.8"
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4">
            <h3 className="mb-3 text-sm font-semibold text-[var(--color-foreground)]">
              Skills
            </h3>
            <div className="mb-3 flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                placeholder="Type a skill and press Enter"
                className={`${inputClass} flex-1`}
              />
              <button
                onClick={addSkill}
                disabled={!skillInput.trim()}
                className="rounded-lg bg-[var(--color-primary)] px-3 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-50 cursor-pointer"
              >
                Add
              </button>
            </div>
            {resumeData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 rounded-full bg-[var(--color-primary)]/10 px-3 py-1 text-xs font-medium text-[var(--color-primary)]"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="ml-0.5 cursor-pointer hover:opacity-70"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Preview */}
        <div className={`${activeTab !== "preview" ? "hidden sm:block" : ""}`}>
          <div className="sticky top-4">
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <h3 className="mb-3 text-sm font-semibold text-[var(--color-foreground)]">
                Live Preview
              </h3>
              <div
                className="overflow-auto rounded-lg border border-[var(--color-border)] bg-white"
                style={{ aspectRatio: "8.5/11" }}
              >
                <div className="p-6 text-xs text-gray-800">
                  {/* Header */}
                  {resumeData.personalInfo.fullName && (
                    <h2
                      className={`mb-1 font-bold ${
                        template === "creative"
                          ? "text-lg text-purple-700"
                          : template === "modern"
                          ? "text-lg text-blue-600"
                          : template === "minimal"
                          ? "text-base font-normal tracking-widest text-gray-500"
                          : "text-lg text-gray-900"
                      }`}
                    >
                      {resumeData.personalInfo.fullName.toUpperCase()}
                    </h2>
                  )}

                  <div className="mb-3 flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-gray-500">
                    {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
                    {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
                    {resumeData.personalInfo.location && <span>{resumeData.personalInfo.location}</span>}
                  </div>
                  <div className="mb-4 flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-gray-500">
                    {resumeData.personalInfo.linkedin && <span>{resumeData.personalInfo.linkedin}</span>}
                    {resumeData.personalInfo.website && <span>{resumeData.personalInfo.website}</span>}
                  </div>

                  {/* Summary */}
                  {resumeData.summary && (
                    <div className="mb-4">
                      <h3
                        className={`mb-1 border-b pb-1 text-[10px] font-bold uppercase tracking-wider ${
                          template === "modern"
                            ? "border-blue-200 text-blue-600"
                            : template === "creative"
                            ? "border-purple-200 text-purple-600"
                            : template === "minimal"
                            ? "border-gray-200 text-gray-400"
                            : "border-gray-300 text-gray-700"
                        }`}
                      >
                        Professional Summary
                      </h3>
                      <p className="text-[10px] leading-relaxed text-gray-600">
                        {resumeData.summary}
                      </p>
                    </div>
                  )}

                  {/* Experience */}
                  {resumeData.experience.some((e) => e.jobTitle || e.company) && (
                    <div className="mb-4">
                      <h3
                        className={`mb-1 border-b pb-1 text-[10px] font-bold uppercase tracking-wider ${
                          template === "modern"
                            ? "border-blue-200 text-blue-600"
                            : template === "creative"
                            ? "border-purple-200 text-purple-600"
                            : template === "minimal"
                            ? "border-gray-200 text-gray-400"
                            : "border-gray-300 text-gray-700"
                        }`}
                      >
                        Work Experience
                      </h3>
                      {resumeData.experience
                        .filter((e) => e.jobTitle || e.company)
                        .map((exp) => (
                          <div key={exp.id} className="mb-2">
                            <div className="flex justify-between">
                              <span className="text-[10px] font-bold text-gray-800">
                                {exp.jobTitle}
                              </span>
                              <span className="text-[9px] text-gray-400">
                                {[exp.startDate, exp.endDate || "Present"]
                                  .filter(Boolean)
                                  .join(" - ")}
                              </span>
                            </div>
                            {exp.company && (
                              <div className="text-[10px] text-gray-500">{exp.company}</div>
                            )}
                            {exp.description && (
                              <p className="mt-0.5 text-[9px] leading-relaxed text-gray-600">
                                {exp.description}
                              </p>
                            )}
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Education */}
                  {resumeData.education.some((e) => e.degree || e.school) && (
                    <div className="mb-4">
                      <h3
                        className={`mb-1 border-b pb-1 text-[10px] font-bold uppercase tracking-wider ${
                          template === "modern"
                            ? "border-blue-200 text-blue-600"
                            : template === "creative"
                            ? "border-purple-200 text-purple-600"
                            : template === "minimal"
                            ? "border-gray-200 text-gray-400"
                            : "border-gray-300 text-gray-700"
                        }`}
                      >
                        Education
                      </h3>
                      {resumeData.education
                        .filter((e) => e.degree || e.school)
                        .map((edu) => (
                          <div key={edu.id} className="mb-2">
                            <div className="flex justify-between">
                              <span className="text-[10px] font-bold text-gray-800">
                                {edu.degree}
                              </span>
                              <span className="text-[9px] text-gray-400">
                                {[edu.startYear, edu.endYear]
                                  .filter(Boolean)
                                  .join(" - ")}
                              </span>
                            </div>
                            {edu.school && (
                              <div className="text-[10px] text-gray-500">{edu.school}</div>
                            )}
                            {edu.gpa && (
                              <div className="text-[9px] text-gray-400">GPA: {edu.gpa}</div>
                            )}
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Skills */}
                  {resumeData.skills.length > 0 && (
                    <div className="mb-4">
                      <h3
                        className={`mb-1 border-b pb-1 text-[10px] font-bold uppercase tracking-wider ${
                          template === "modern"
                            ? "border-blue-200 text-blue-600"
                            : template === "creative"
                            ? "border-purple-200 text-purple-600"
                            : template === "minimal"
                            ? "border-gray-200 text-gray-400"
                            : "border-gray-300 text-gray-700"
                        }`}
                      >
                        Skills
                      </h3>
                      <p className="text-[10px] text-gray-600">
                        {resumeData.skills.join(
                          template === "modern"
                            ? " • "
                            : template === "creative"
                            ? " | "
                            : ", "
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Download Button */}
            <button
              onClick={generatePDF}
              disabled={generating}
              className="btn-primary mt-4 w-full cursor-pointer"
            >
              {generating ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="spinner" /> Generating PDF...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download PDF
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
