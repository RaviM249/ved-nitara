"use client";

import { useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { postRequirementSchema } from "@/lib/validations";
import { api } from "@/lib/stubs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

export default function PostRequirementPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [reqItems, setReqItems] = useState<string[]>([]);
  const [newReq, setNewReq] = useState("");

  const form = useForm<z.infer<typeof postRequirementSchema>>({
    resolver: zodResolver(postRequirementSchema),
    defaultValues: {
      roleNeeded: "",
      subject: "",
      duration: "Short-term",
      budgetMin: 0,
      budgetMax: 0,
      city: "Mumbai",
      description: "",
      requirements: [],
    },
  });

  const addRequirement = () => {
    if (newReq && !reqItems.includes(newReq)) {
      const updatedReqs = [...reqItems, newReq];
      setReqItems(updatedReqs);
      form.setValue("requirements", updatedReqs as any);
      form.clearErrors("requirements");
      setNewReq("");
    }
  };

  const removeRequirement = (reqToRemove: string) => {
    const updatedReqs = reqItems.filter(r => r !== reqToRemove);
    setReqItems(updatedReqs);
    form.setValue("requirements", updatedReqs as any);
  };

  async function onSubmit(values: z.infer<typeof postRequirementSchema>) {
    try {
      setIsLoading(true);
      // Ensure requirements array is populated in values
      const submitData = { ...values, requirements: reqItems };
      
      const res = await api.postRequirement(submitData);
      if (res.success) {
        toast.success("Requirement posted successfully!");
        router.push("/school/requirements");
      }
    } catch (e) {
      toast.error("Failed to post requirement");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <PageWrapper>
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="text-gray-400 hover:text-white rounded-full">
          <Link href="/school/requirements">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-display text-white">Post New Requirement</h1>
          <p className="text-gray-400 text-sm">Find the perfect guest faculty for your institution.</p>
        </div>
      </div>

      <Card className="bg-[#1f1f1f] border-white/5 max-w-4xl">
        <CardContent className="p-6 md:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="roleNeeded"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Role Needed</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Guest Lecturer" className="bg-[#141414] border-white/10 text-white focus-visible:ring-[#E50914]" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Subject / Discipline</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Method Acting, Voice Mod" className="bg-[#141414] border-white/10 text-white focus-visible:ring-[#E50914]" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Duration</FormLabel>
                      <FormControl>
                        <select 
                          className="w-full h-10 px-3 py-2 bg-[#141414] border border-white/10 rounded-md text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#E50914] focus:border-[#E50914]"
                          {...field}
                        >
                          <option value="Short-term">Short-term (1-4 weeks)</option>
                          <option value="Long-term">Long-term (1+ months)</option>
                          <option value="Project-based">Project/Workshop based</option>
                        </select>
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">City</FormLabel>
                      <FormControl>
                        <Input placeholder="Mumbai" className="bg-[#141414] border-white/10 text-white focus-visible:ring-[#E50914]" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col mt-2 md:mt-0 justify-end">
                      <FormLabel className="text-gray-300 mb-2">Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal bg-[#141414] border-white/10 text-white hover:bg-[#141414] hover:text-white",
                                !field.value && "text-gray-500"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50 text-[#E50914]" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-[#1f1f1f] border-white/10" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            initialFocus
                            className="text-white"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="budgetMin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Minimum Budget (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="50000" className="bg-[#141414] border-white/10 text-white focus-visible:ring-[#E50914]" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="budgetMax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Maximum Budget (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="100000" className="bg-[#141414] border-white/10 text-white focus-visible:ring-[#E50914]" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Detailed Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Provide details about the role, expectations, and curriculum..." 
                        className="bg-[#141414] border-white/10 text-white h-32 focus-visible:ring-[#E50914]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <FormLabel className="text-gray-300">Key Requirements</FormLabel>
                <div className="flex gap-2">
                  <Input 
                    value={newReq} 
                    onChange={(e) => setNewReq(e.target.value)} 
                    placeholder="e.g. 5+ years of industry experience" 
                    className="bg-[#141414] border-white/10 text-white focus-visible:ring-[#E50914]" 
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                  />
                  <Button type="button" onClick={addRequirement} className="bg-[#E50914] text-white hover:bg-[#b80710]">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {reqItems.length > 0 && (
                  <ul className="grid sm:grid-cols-2 gap-2 mt-4">
                    {reqItems.map((req, i) => (
                      <li key={i} className="flex items-start text-sm text-gray-300 bg-[#141414] p-3 rounded-lg border border-white/5 group">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#E50914] mt-1.5 mr-2 shrink-0"></span>
                        <span className="flex-1">{req}</span>
                        <button type="button" onClick={() => removeRequirement(req)} className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                          <X className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {form.formState.errors.requirements && (
                  <p className="text-red-400 text-xs font-medium">{form.formState.errors.requirements.message}</p>
                )}
              </div>

              <div className="pt-6 border-t border-white/10 flex justify-end gap-3">
                <Button type="button" variant="outline" asChild className="border-white/10 text-white hover:bg-white/5">
                  <Link href="/school/requirements">Cancel</Link>
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-[#E50914] hover:bg-[#b80710] text-white px-8"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Post Requirement
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
