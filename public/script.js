const initialPath = "./heroicons/src";

const copyToClipboard = str => {
  const el = document.createElement("textarea");
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
};

const makeURL = ({ fileName, type = "outline", initialPath }) => {
  /* XXX: It may change in the future if more types are added, and more... sizes? */
  const size = type === "outline" ? "md" : "sm";

  return `${initialPath}/${type}-${size}/${size}-${fileName}.svg`;
};

fetch("./icons.json")
  .then(res => res.json())
  .then(icons => {
    const iconHolderTemplate = document.getElementById("icon-holder");

    icons.map(icon => {
      const iconHolderClone = iconHolderTemplate.content.cloneNode(true);
      const fileName = icon.fileName;
      const iconHumanName = icon.humanName ?? fileName.replace(/-/g, " ");
      const iconKeywords = icon.keywords;
      const iconURL = makeURL({ fileName, initialPath });

      const $iconHolder = iconHolderClone.querySelector(".icon-holder");
      $iconHolder.setAttribute(
        "data-keywords",
        `${iconHumanName} ${iconKeywords}`
      );
      $iconHolder.setAttribute("title", iconHumanName);

      const $svg = $iconHolder.querySelector(".icon-holder__svg > img");
      $svg.setAttribute("src", iconURL);

      $iconHolder
        .querySelector(".icon-holder__actions > .action-button--copy")
        .addEventListener("click", function() {
          fetch(iconURL)
            .then(res => res.text())
            .then(copyToClipboard);
        });

      $iconHolder
        .querySelector(".icon-holder__actions > .action-button--download")
        .setAttribute("href", iconURL);

      document.getElementById("icon-list").appendChild(iconHolderClone);
    });
  })
  .then(() => {
    const $allIcons = document.getElementsByClassName("icon-holder");
    
    document.getElementById("icon-search")
    .addEventListener("keyup", ({ target }) => {
        console.log($allIcons)
        for (const $icon of $allIcons) {
          if ($icon.getAttribute("data-keywords").includes(target.value)) {
            $icon.removeAttribute("style");
            continue;
          }
          $icon.setAttribute("style", "display: none !important");
        }
      });
  });
