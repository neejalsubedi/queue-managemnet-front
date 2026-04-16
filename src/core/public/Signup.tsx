import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { differenceInYears, parseISO } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSignup } from "@/components/ApiCall/PublicApi";
import { signupSchema } from "@/components/formValidation/Schemas";
import type { z } from "zod";

type SignupFormData = z.infer<typeof signupSchema>;

const calculateAge = (dob: string | null | undefined): number | null => {
  if (!dob) return null;
  try {
    return differenceInYears(new Date(), parseISO(dob));
  } catch {
    return null;
  }
};

const Signup = () => {
  const navigate = useNavigate();
  const { mutate: postSignUpData, isPending } = useSignup();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      full_name: "",
      username: "",
      email: "",
      password: "",
      phone: "",
      gender: "M",
      date_of_birth: "",
      age: null,
    },
  });

  const onSubmit = (data: SignupFormData) => {
    const age = calculateAge(data.date_of_birth);

    const payload = {
      full_name: data.full_name,
      username: data.username,
      email: data.email,
      password: data.password,
      phone: data.phone,
      gender: data.gender,
      date_of_birth: data.date_of_birth,
      age: age,
    };

    postSignUpData(payload, {
      onSuccess: () => {
        form.reset();
        navigate("/login");
      },
    });
  };

  return (
    <div className="relative h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 overflow-hidden">
      <div className="relative z-10 w-full max-w-5xl bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden border border-white/70">
        {/* Form Container */}
        <div className="w-full flex flex-col justify-center p-6 sm:p-8">
          {/* Header */}
          <Button variant="ghost" size="sm" className="mb-4 w-fit -ml-2" asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to home
            </Link>
          </Button>
          <div className="mb-6 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">Create Your Account</h2>
            <p className="text-gray-600 text-sm">Fill in your details to get started</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel className="text-sm">Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your full name"
                          {...field}
                          className="h-10 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Choose a username"
                          {...field}
                          className="h-10 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          {...field}
                          className="h-10 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel className="text-sm">Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter a strong password"
                          {...field}
                          className="h-10 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
                        />
                      </FormControl>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Must contain uppercase, lowercase, number, and special character
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="Enter phone number"
                          {...field}
                          className="h-10 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-10 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="M">Male</SelectItem>
                          <SelectItem value="F">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date_of_birth"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel className="text-sm">Date of Birth</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          className="h-10 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-11 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 font-semibold mt-4 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-4 text-center">
            <p className="text-xs sm:text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;