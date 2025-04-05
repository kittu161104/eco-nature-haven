
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { CalendarIcon, Leaf, Droplet, Sun, Plus, Trash2, BarChart2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface PlantCareTask {
  id: string;
  plantId: string;
  taskType: 'water' | 'fertilize' | 'prune' | 'repot';
  scheduledDate: Date;
  completed: boolean;
  notes?: string;
}

interface UserPlant {
  id: string;
  name: string;
  species: string;
  acquiredDate: Date;
  lastWatered?: Date;
  nextWateringDate?: Date;
  wateringFrequency?: number; // in days
  lastFertilized?: Date;
  fertilizingFrequency?: number; // in days
  sunlightNeeds: 'low' | 'medium' | 'high';
  notes?: string;
  image?: string;
}

const PlantCareTracker: React.FC = () => {
  const [plants, setPlants] = useState<UserPlant[]>([]);
  const [tasks, setTasks] = useState<PlantCareTask[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAddingPlant, setIsAddingPlant] = useState(false);
  const [newPlant, setNewPlant] = useState<Partial<UserPlant>>({
    name: '',
    species: '',
    acquiredDate: new Date(),
    sunlightNeeds: 'medium'
  });
  const { toast } = useToast();

  // Load data from localStorage
  useEffect(() => {
    const storedPlants = localStorage.getItem('userPlants');
    if (storedPlants) {
      try {
        const parsedPlants = JSON.parse(storedPlants, (key, value) => {
          if (key.toLowerCase().includes('date')) {
            return new Date(value);
          }
          return value;
        });
        setPlants(parsedPlants);
      } catch (error) {
        console.error('Error loading plants:', error);
      }
    }

    const storedTasks = localStorage.getItem('plantCareTasks');
    if (storedTasks) {
      try {
        const parsedTasks = JSON.parse(storedTasks, (key, value) => {
          if (key === 'scheduledDate') {
            return new Date(value);
          }
          return value;
        });
        setTasks(parsedTasks);
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('userPlants', JSON.stringify(plants));
  }, [plants]);

  useEffect(() => {
    localStorage.setItem('plantCareTasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddPlant = () => {
    if (!newPlant.name || !newPlant.species) {
      toast({
        title: "Missing information",
        description: "Please enter both plant name and species.",
        variant: "destructive"
      });
      return;
    }

    const plant: UserPlant = {
      id: `plant-${Date.now()}`,
      name: newPlant.name || '',
      species: newPlant.species || '',
      acquiredDate: newPlant.acquiredDate || new Date(),
      sunlightNeeds: newPlant.sunlightNeeds as 'low' | 'medium' | 'high' || 'medium',
      wateringFrequency: newPlant.wateringFrequency,
      fertilizingFrequency: newPlant.fertilizingFrequency,
      notes: newPlant.notes
    };

    setPlants([...plants, plant]);
    setNewPlant({
      name: '',
      species: '',
      acquiredDate: new Date(),
      sunlightNeeds: 'medium'
    });
    setIsAddingPlant(false);

    toast({
      title: "Plant added",
      description: `${plant.name} has been added to your collection.`
    });
  };

  const addCareTask = (plantId: string, taskType: 'water' | 'fertilize' | 'prune' | 'repot') => {
    const newTask: PlantCareTask = {
      id: `task-${Date.now()}`,
      plantId,
      taskType,
      scheduledDate: selectedDate,
      completed: false
    };

    setTasks([...tasks, newTask]);
    toast({
      title: "Task scheduled",
      description: `${taskType} task scheduled for ${format(selectedDate, 'PPP')}.`
    });
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast({
      title: "Task removed",
      description: "The care task has been removed from your schedule."
    });
  };

  const deletePlant = (plantId: string) => {
    setPlants(plants.filter(plant => plant.id !== plantId));
    // Also remove any tasks associated with this plant
    setTasks(tasks.filter(task => task.plantId !== plantId));
    toast({
      title: "Plant removed",
      description: "The plant and its care tasks have been removed."
    });
  };

  const waterPlant = (plantId: string) => {
    const now = new Date();
    setPlants(plants.map(plant => {
      if (plant.id === plantId) {
        const nextDate = plant.wateringFrequency ? 
          new Date(now.getTime() + plant.wateringFrequency * 24 * 60 * 60 * 1000) : 
          undefined;
          
        return {
          ...plant,
          lastWatered: now,
          nextWateringDate: nextDate
        };
      }
      return plant;
    }));

    toast({
      title: "Plant watered",
      description: "Watering recorded successfully."
    });
  };

  const fertilizePlant = (plantId: string) => {
    setPlants(plants.map(plant => {
      if (plant.id === plantId) {
        return {
          ...plant,
          lastFertilized: new Date()
        };
      }
      return plant;
    }));

    toast({
      title: "Plant fertilized",
      description: "Fertilizing recorded successfully."
    });
  };

  // Filter tasks for the selected date
  const tasksForSelectedDate = tasks.filter(task => 
    task.scheduledDate.toDateString() === selectedDate.toDateString()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Plant Care Tracker</h2>
        <Button 
          onClick={() => setIsAddingPlant(!isAddingPlant)}
          className="bg-green-700 hover:bg-green-800"
        >
          {isAddingPlant ? 'Cancel' : <><Plus size={16} className="mr-2" /> Add Plant</>}
        </Button>
      </div>

      {isAddingPlant && (
        <Card className="bg-black border-green-700">
          <CardHeader>
            <CardTitle>Add New Plant</CardTitle>
            <CardDescription>Enter details about your plant</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="plant-name">Plant Name</Label>
              <Input
                id="plant-name"
                value={newPlant.name || ''}
                onChange={(e) => setNewPlant({...newPlant, name: e.target.value})}
                placeholder="E.g., Living Room Fern"
                className="bg-black border-green-700"
              />
            </div>
            
            <div>
              <Label htmlFor="plant-species">Species</Label>
              <Input
                id="plant-species"
                value={newPlant.species || ''}
                onChange={(e) => setNewPlant({...newPlant, species: e.target.value})}
                placeholder="E.g., Boston Fern"
                className="bg-black border-green-700"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sunlight-needs">Sunlight Needs</Label>
                <Select
                  value={newPlant.sunlightNeeds}
                  onValueChange={(value: any) => setNewPlant({...newPlant, sunlightNeeds: value})}
                >
                  <SelectTrigger className="bg-black border-green-700">
                    <SelectValue placeholder="Select sunlight needs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Light</SelectItem>
                    <SelectItem value="medium">Medium Light</SelectItem>
                    <SelectItem value="high">Bright Light</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="watering-frequency">Days Between Watering</Label>
                <Input
                  id="watering-frequency"
                  type="number"
                  value={newPlant.wateringFrequency || ''}
                  onChange={(e) => setNewPlant({...newPlant, wateringFrequency: parseInt(e.target.value)})}
                  placeholder="E.g., 7"
                  className="bg-black border-green-700"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="plant-notes">Notes</Label>
              <Input
                id="plant-notes"
                value={newPlant.notes || ''}
                onChange={(e) => setNewPlant({...newPlant, notes: e.target.value})}
                placeholder="Any special care instructions..."
                className="bg-black border-green-700"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleAddPlant} className="bg-green-700 hover:bg-green-800 w-full">
              Add Plant to Collection
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h3 className="text-xl font-semibold mb-4">My Plant Collection</h3>
          {plants.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-green-700 rounded-lg">
              <Leaf className="mx-auto h-10 w-10 text-green-600 mb-2" />
              <p className="text-lg font-medium">Your collection is empty</p>
              <p className="text-sm text-gray-400">Add your first plant to start tracking</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plants.map((plant) => (
                <Card key={plant.id} className="bg-black border-green-700">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-white">{plant.name}</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => deletePlant(plant.id)}
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription>{plant.species}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Sun className="h-4 w-4 mr-2 text-green-500" />
                          <span className="text-sm">
                            {plant.sunlightNeeds === 'low' && 'Low Light'}
                            {plant.sunlightNeeds === 'medium' && 'Medium Light'}
                            {plant.sunlightNeeds === 'high' && 'Bright Light'}
                          </span>
                        </div>
                        
                        <div className="flex items-center">
                          <Droplet className="h-4 w-4 mr-1 text-blue-500" /> 
                          <span className="text-sm">
                            {plant.wateringFrequency ? `Every ${plant.wateringFrequency} days` : 'As needed'}
                          </span>
                        </div>
                      </div>
                      
                      {plant.lastWatered && (
                        <div className="text-xs text-gray-400">
                          Last watered: {format(plant.lastWatered, 'PP')}
                        </div>
                      )}
                      
                      {plant.nextWateringDate && (
                        <div className="text-xs text-gray-400">
                          Next watering: {format(plant.nextWateringDate, 'PP')}
                        </div>
                      )}
                      
                      {plant.notes && (
                        <div className="text-xs mt-2 p-2 bg-black border-l-2 border-green-700">
                          {plant.notes}
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="bg-blue-700 hover:bg-blue-800 flex-1"
                      onClick={() => waterPlant(plant.id)}
                    >
                      <Droplet className="h-4 w-4 mr-1" /> Water
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-green-700 hover:bg-green-800 flex-1"
                      onClick={() => fertilizePlant(plant.id)}
                    >
                      <Leaf className="h-4 w-4 mr-1" /> Fertilize
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div>
          <Card className="bg-black border-green-700">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Care Schedule</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="bg-black border-green-700">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {format(selectedDate, 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-black border-green-700">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      className="bg-black text-white"
                    />
                  </PopoverContent>
                </Popover>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {plants.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-400">Add plants to schedule care tasks</p>
                </div>
              ) : tasksForSelectedDate.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-400">No tasks scheduled for this date</p>
                  <p className="text-xs text-gray-500 mt-1">Select a plant below to add tasks</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasksForSelectedDate.map(task => {
                    const plant = plants.find(p => p.id === task.plantId);
                    return (
                      <div 
                        key={task.id}
                        className="flex items-center justify-between p-2 border-l-4 border-green-700 bg-black/30"
                      >
                        <div className="flex items-center">
                          <Checkbox 
                            checked={task.completed}
                            onCheckedChange={() => toggleTaskCompletion(task.id)}
                            className="mr-2 border-green-600"
                          />
                          <div>
                            <p className={`text-sm ${task.completed ? 'line-through opacity-70' : ''}`}>
                              {plant?.name} - {task.taskType.charAt(0).toUpperCase() + task.taskType.slice(1)}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteTask(task.id)}
                          className="h-7 w-7 rounded-full hover:bg-red-900/20"
                        >
                          <Trash2 className="h-3 w-3 text-red-500" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {plants.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Add task for {format(selectedDate, 'MMM d')}:</p>
                  <div className="space-y-2">
                    {plants.map(plant => (
                      <div key={plant.id} className="flex flex-wrap gap-1">
                        <span className="text-xs mr-1 mt-1">{plant.name}:</span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => addCareTask(plant.id, 'water')}
                          className="h-6 text-xs bg-blue-900/20 border-blue-700 hover:bg-blue-800/30"
                        >
                          Water
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => addCareTask(plant.id, 'fertilize')}
                          className="h-6 text-xs bg-green-900/20 border-green-700 hover:bg-green-800/30"
                        >
                          Fertilize
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => addCareTask(plant.id, 'prune')}
                          className="h-6 text-xs bg-amber-900/20 border-amber-700 hover:bg-amber-800/30"
                        >
                          Prune
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => addCareTask(plant.id, 'repot')}
                          className="h-6 text-xs bg-purple-900/20 border-purple-700 hover:bg-purple-800/30"
                        >
                          Repot
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PlantCareTracker;
