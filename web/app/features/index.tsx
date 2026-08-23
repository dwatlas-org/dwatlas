import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function Index() {
  return (
    <div>
      <h2 className="text-xl font-bold">Home</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      <Card className="my-10 max-w-sm">
        <CardHeader>
          <CardTitle>Vehicles and Drivers</CardTitle>
          <CardDescription>
            Ipsum dolor sit amet, consectetur adipiscing elit.
          </CardDescription>
        </CardHeader>
        <CardContent>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </CardContent>
      </Card>
    </div>
  );
}
