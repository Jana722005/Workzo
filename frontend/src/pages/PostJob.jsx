import { useState } from "react";

export default function PostJob() {
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    title: "",
    category: "",
    location: "",
    description: "",
    budget: "",
    memberLimit: 1,
  });

    const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
        ...form,
        [name]:
        name === "memberLimit" || name === "budget"
            ? Number(value)
            : value,
    });
    };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("JOB PAYLOAD:", form);
    
    const res = await fetch("http://localhost:5000/api/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Job posted successfully");
      setForm({
        title: "",
        category: "",
        location: "",
        description: "",
        budget: "",
      });
    } else {
      alert("Failed to post job");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-2">
        Post a Job
      </h1>
      <p className="text-gray-600 mb-6">
        Tell us what work you need done. It takes less than 2 minutes.
      </p>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Job Title */}
          <div>
            <label className="block font-medium mb-1">
              What work do you need?
            </label>
            <input
              type="text"
              name="title"
              placeholder="e.g. House cleaning, AC repair"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Category + Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">
                Category
              </label>
              <select
                name="category"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="">Select category</option>
                <option>Plumbing</option>
                <option>Electrical</option>
                <option>Cleaning</option>
                <option>Painting</option>
                <option>Carpentry</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                placeholder="Area / City"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={form.location}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="block font-medium mb-1">
              Expected Budget (optional)
            </label>
            <input
              type="number"
              name="budget"
              placeholder="₹ Amount (optional)"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.budget}
              onChange={handleChange}
            />
          </div>

          {/* Member Limit */}
            <div>
            <label className="block font-medium mb-1">
                Number of workers needed
            </label>

            <input
                type="number"
                name="memberLimit"
                min="1"
                placeholder="e.g. 1, 2, 5"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={form.memberLimit}
                onChange={handleChange}
                required
            />

            <p className="text-sm text-gray-500 mt-1">
                Enter how many workers you need for this job.
            </p>
            </div>


          {/* Description */}
          <div>
            <label className="block font-medium mb-1">
              Describe the job
            </label>
            <textarea
              name="description"
              rows="4"
              placeholder="Briefly explain what needs to be done..."
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Post Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
