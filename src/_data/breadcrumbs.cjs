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
            key: "Help for you",
            href: "/lafires/help-for-you/"
          },
          {
            key: "Health and safety",
            href: "/lafires/help-for-you/health-and-safety/"
          },
          {
            key: "Preplace personal documents",
            href: "/lafires/help-for-you/replace-personal-documents/"
          }
        ]
      },
      // Once translations are completed, we will need to duplicate this for each language
      {
        key: "Incendios de Los Ángeles en 2025",
        href: "/lafires/es/",
        children: [
          {
            key: "Ayuda para usted y su familia",
            href: "/lafires/es/help-for-you/"
          },
          {
            key: "Salud y seguridad",
            href: "/lafires/es/help-for-you/health-and-safety/"
          }
        ]
      },
      {
        key: "2025년 로스앤젤레스 화재",
        href: "/lafires/ko/",
        children: [
          {
            key: "당신과 당신의 가족을 위한 도움",
            href: "/lafires/ko/help-for-you/"
          },
          {
            key: "건강과 안전",
            href: "/lafires/ko/help-for-you/health-and-safety/"
          }
        ]
      },
      {
        key: "Các Đám Cháy ở Los Angeles năm 2025",
        href: "/lafires/vi/",
        children: [
          {
            key: "Giúp đỡ cho bạn và gia đình của bạn",
            href: "/lafires/vi/help-for-you/"
          },
          {
            key: "Sức khỏe và an toàn",
            href: "/lafires/vi/help-for-you/health-and-safety/"
          }
        ]
      },
      {
        key: "Sunog sa Los Angeles Ngayong 2025",
        href: "/lafires/tl/",
        children: [
          {
            key: "Tulong para sa iyo at sa iyong pamilya",
            href: "/lafires/tl/help-for-you/"
          },
          {
            key: "Kalusugan at kaligtasan",
            href: "/lafires/tl/help-for-you/health-and-safety/"
          }
        ]
      },
      {
        key: "2025թ․ Լոս Անջելեսի հրդեհներ",
        href: "/lafires/hy/",
        children: [
          {
            key: "Օգնություն ձեզ և ձեր ընտանիքին",
            href: "/lafires/hy/help-for-you/"
          },
          {
            key: "Առողջություն և անվտանգություն",
            href: "/lafires/hy/help-for-you/health-and-safety/"
          }
        ]
      },
      {
        key: "2025年洛杉矶大火",
        href: "/lafires/zh-hans/",
        children: [
          {
            key: "为您和您的家人提供帮助",
            href: "/lafires/zh-hans/help-for-you/"
          },
          {
            key: "健康与安全",
            href: "/lafires/zh-hans/help-for-you/health-and-safety/"
          }
        ]
      },
      {
        key: "2025 年洛杉磯大火",
        href: "/lafires/zh-hant/",
        children: [
          {
            key: "為您和您的家人提供幫助",
            href: "/lafires/zh-hant/help-for-you/"
          },
          {
            key: "健康與安全",
            href: "/lafires/zh-hant/help-for-you/health-and-safety/"
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
