import LessonPlanView from './LessonPlanView';
import SlidesView from './SlidesView';
import AssessmentView from './AssessmentView';

export default function LessonContent({ lessonPlan, slides, assessment }) {
  const hasContent = lessonPlan || slides || assessment;

  if (!hasContent) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
        Dars kontenti hali mavjud emas
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <LessonPlanView plan={lessonPlan} />
      <SlidesView slidesData={slides} />
      <AssessmentView assessment={assessment} />
    </div>
  );
}
