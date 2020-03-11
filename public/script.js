const initialPath = "/heroicons/src";

const copyToClipboard = str => {
  const el = document.createElement("textarea");
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
};

const makeURL = ({ iconName, type = "outline", initialPath }) => {
  /* XXX: It may change in the future if more types are added, and more... sizes? */
  const size = type === "outline" ? "md" : "sm";

  return `${initialPath}/${type}-${size}/${size}-${iconName}.svg`;
};

fetch("./icons.json")
  .then(res => res.json())
  .then(icons => {
    const iconHolderTemplate = document.getElementById("icon-holder");
    
    icons.map(icon => {
      const iconHolderClone = iconHolderTemplate.content.cloneNode(true);
      const iconName = icon.name;
      const iconKeywords = icon.keywords;
      const iconURL = makeURL({ iconName, initialPath });

      const $iconHolder = iconHolderClone.querySelector(".icon-holder");
      $iconHolder.setAttribute("data-keywords", iconKeywords);

      const $svg = $iconHolder.querySelector(".icon-holder__svg");
      $svg.setAttribute("src", iconURL);

      const $name = $iconHolder.querySelector(".icon-holder__name");
      $name.innerText = iconName.replace(/-/g, " ")

      $iconHolder
        .querySelector(".icon-holder__actions > .action-button--copy")
        .addEventListener("click", function() {
          fetch(iconURL)
            .then(res => res.text())
            .then(copyToClipboard)
            .then(() => {
              this.classList.remove("bg-gray-200")
              this.classList.add("bg-orange-300")
              setTimeout(() => {
                this.classList.add("bg-gray-200")
                this.classList.remove("bg-orange-300")
              }, 500)
            })
        });

      $iconHolder
        .querySelector(".icon-holder__actions > .action-button--download")
        .setAttribute("href", iconURL);

      document.getElementById("icon-list").appendChild(iconHolderClone);
    });
  });
