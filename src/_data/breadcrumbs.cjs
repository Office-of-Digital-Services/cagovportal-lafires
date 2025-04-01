//@ts-check

/** @type {breadcrumbnode[]} */
const data = [
  {
    key: "Home",
    href: "/",
    children: [
      {
        key: "2025 Los Angeles Fires",
        href: "/LAfires/",
        children: [
          {
            key: "Get help in person",
            href: "/lafires/get-help-in-person/"
          }
        ]
      },
      // Once translations are completed, we will need to duplicate this for each language
      {
        key: "Incendies de Los Angeles 2025",
        href: "/lafires/fr/",
        children: [
          {
            key: "Obtenir de l'aide en personne",
            href: "/lafires/fr/get-help-in-person/"
          }
        ]
      },
      {
        key: "Incendios de Los Ángeles en 2025",
        href: "/lafires/es/",
        children: [
          {
            key: "Obtener ayuda en persona",
            href: "/lafires/es/get-help-in-person/"
          }
        ]
      },
      {
        key: "2025년 로스앤젤레스 화재",
        href: "/lafires/ko/",
        children: [
          {
            key: "로스앤젤레스 화재 도움 받기",
            href: "/lafires/ko/get-help-in-person/"
          }
        ]
      },
      {
        key: "Các Đám Cháy ở Los Angeles năm 2025",
        href: "/lafires/vi/",
        children: [
          {
            key: "Nhận sự giúp đỡ trực tiếp",
            href: "/lafires/vi/get-help-in-person/"
          }
        ]
      },
      {
        key: "Sunog sa Los Angeles Ngayong 2025",
        href: "/lafires/tl/",
        children: [
          {
            key: "Nakuha ang tulong sa loob",
            href: "/lafires/tl/get-help-in-person/"
          }
        ]
      },
      {
        key: "2025թ․ Լոս Անջելեսի հրդեհներ",
        href: "/lafires/hy/",
        children: [
          {
            key: "Նախաճաշի հրդեհներ",
            href: "/lafires/hy/get-help-in-person/"
          }
        ]
      },
      {
        key: "2025年洛杉矶大火",
        href: "/lafires/zh-hans/",
        children: [
          {
            key: "洛杉矶大火帮助",
            href: "/lafires/zh-hans/get-help-in-person/"
          }
        ]
      },
      {
        key: "2025 年洛杉磯大火",
        href: "/lafires/zh-hant/",
        children: [
          {
            key: "洛杉磯大火幫助",
            href: "/lafires/zh-hant/get-help-in-person/"
          }
        ]
      }
    ]
  }
];


/**
 * @typedef {object} breadcrumbnode
 * @property {string} key
 * @property {string} href
 * @property {breadcrumbnode[]} [children]
 */

/**
 * @typedef {object} flatbreadcrumb
 * @property {string} key
 * @property {breadcrumblink[]} links
 */

/**
 * @typedef {object} breadcrumblink
 * @property {string} title
 * @property {string} href
 */

function flattenData() {
  /** @type {flatbreadcrumb[]} */
  const result = [];

  /**
   * @param {breadcrumbnode} node
   * @param {breadcrumblink[]} [links]
   */
  function flattenRecursive(node, links = []) {
    /** @type {flatbreadcrumb} */
    const flatbreadcrumb = {
      key: node.key,
      links: [...links, { title: node.key, href: node.href }]
    };

    result.push(flatbreadcrumb);

    node.children?.forEach(child =>
      flattenRecursive(child, flatbreadcrumb.links)
    );
  }

  data.forEach(x => flattenRecursive(x));

  return result;
}

module.exports = flattenData();

/*
Final data looks like this

const data = [
  {
    key: "Home",
    links: [
      {
        title: "Home",
        href: "/"
      }
    ]
  },
  {
    key: "Services",
    links: [
      {
        title: "Home",
        href: "/"
      },
      {
        title: "Services",
        href: "/services/"
      }
    ]
  },
  {
    key: "Departments",
    links: [
      {
        title: "Home",
        href: "/"
      },
      {
        title: "Departments",
        href: "/departments/"
      }
    ]
  },
  {
    key: "Topics",
    links: [
      {
        title: "Home",
        href: "/"
      },
      {
        title: "Services",
        href: "/services/"
      },
      {
        title: "Topics",
        href: "/topics/"
      }
    ]
  }
];
*/
