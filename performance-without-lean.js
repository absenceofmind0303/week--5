const mongoose = require("mongoose");
const Task = require("../src/models/Task");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/interntrack_week5_benchmark");

  await Task.deleteMany({});

  const owner = new mongoose.Types.ObjectId();

  const tasks = Array.from({ length: 1000 }, (_, i) => ({
    title: `Benchmark Task ${i + 1}`,
    description: "Performance benchmark task",
    category: "Testing",
    status: "Not started",
    priority: "medium",
    progress: i % 101,
    estimatedHours: 2,
    owner
  }));

  await Task.insertMany(tasks);

  const filter = { owner };

  const start = process.hrtime.bigint();

  const result = await Task.find(filter)
    .sort({ createdAt: -1 });

  const end = process.hrtime.bigint();

  const elapsedMs = Number(end - start) / 1e6;

  console.log("Performance Comparison - Without lean()");
  console.log("----------------------------------------");
  console.log(`Documents tested: ${result.length}`);
  console.log(`Query time: ${elapsedMs.toFixed(3)} ms`);

  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});
