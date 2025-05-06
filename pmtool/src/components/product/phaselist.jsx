import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import TaskList from "./../task/tasklist";

const PhaseList = ({ phases }) => {
  if (!phases || phases.length === 0) {
    return <div className="text-gray-500 text-sm">No phases available.</div>;
  }

  return (
    <div className="space-y-4 mt-2">
      {phases.map((phase, index) => (
        <Card key={index} className="bg-white shadow-md p-4 rounded-xl">
          <CardContent>
            <h3 className="text-lg font-semibold">{phase.name}</h3>
            <TaskList tasks={phase.tasks} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PhaseList;
