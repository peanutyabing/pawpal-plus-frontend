import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DoughnutChart(props) {
  let labels;
  let dataValues;
  if (props.data.length) {
    labels = props.data.map((row) => props.colMapping[row.id]);
    dataValues = props.data.map((row) => row.no_of_activities);
  }
  const data = {
    labels,
    datasets: [
      {
        label: "# of activities",
        data: dataValues,
        backgroundColor: [
          "#9edae5",
          "#17becf",
          "#dbdb8d",
          "#bcbd22",
          "#c7c7c7",
          "#7f7f7f",
          "#f7b6d2",
          "#e377c2",
          "#c49c94",
          "#8c564b",
          "#c5b0d5",
          "#9467bd",
          "#ff9896",
          "#d62728",
          "#98df8a",
          "#2ca02c",
          "#ffbb78",
          "#ff7f0e",
          "#aec7e8",
          "#1f77b4",
        ],
      },
    ],
  };
  return <Doughnut data={data} />;
}
