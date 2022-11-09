import figlet from "figlet";

function presentation() {
  console.log(
    figlet.textSync("PSWREC", {
      font: "3-D",
      horizontalLayout: "default",
      verticalLayout: "default",
      width: 100,
      whitespaceBreak: true,
    })
  );
}

export default presentation;
