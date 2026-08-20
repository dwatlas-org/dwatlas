import './global.css'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

function App() {
  return (
    <>
      <div className="flex min-h-svh flex-col items-center justify-center gap-4">
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>DeliveryWorkerAtlas</CardTitle>
            <CardDescription>
              Track progress and recent activity for your app.
            </CardDescription>
          </CardHeader>
          <CardContent>
            Your design system is ready. Start building your next component.
          </CardContent>
        </Card>
      </div >
    </>
  )
}

export default App
