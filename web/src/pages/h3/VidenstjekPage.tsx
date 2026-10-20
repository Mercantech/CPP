import LessonIntro from '../../components/LessonIntro'
import LessonLayout from '../../components/LessonLayout'
import Videnstjek from '../../components/Videnstjek'

export function VidenstjekContent() {
  return (
    <>
      <h1>Videnstjek</h1>
      <LessonIntro>
        <p>
          Test dig selv på H3-læringsmålene — og lidt historie. Svar gemmes i browseren
          (localStorage), så du kan vende tilbage.
        </p>
      </LessonIntro>

      <h2>Spørgsmål</h2>
      <Videnstjek />
    </>
  )
}

export default function VidenstjekPage() {
  return (
    <LessonLayout module="h3">
      <VidenstjekContent />
    </LessonLayout>
  )
}

