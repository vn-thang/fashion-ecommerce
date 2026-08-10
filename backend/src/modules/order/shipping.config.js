const SHIPPING_CONFIG = {
  FREESHIP_THRESHOLD: 500000,

  BASE_FEE: 40000,

  ZONES: [
    {
      name: "ZONE_HANOI",
      fee: 20000,
      provinces: [
        "Hà Nội"
      ]
    },
    {
      name: "ZONE_NEAR_HANOI",
      fee: 25000,
      provinces: [
        "Bắc Ninh",
        "Hưng Yên",
        "Ninh Bình",
        "Phú Thọ"
      ]
    },
    {
      name: "ZONE_NORTH",
      fee: 30000,
      provinces: [
        "Hải Phòng",
        "Quảng Ninh",
        "Lào Cai",
        "Lai Châu",
        "Điện Biên",
        "Sơn La",
        "Cao Bằng",
        "Lạng Sơn",
        "Thái Nguyên",
        "Tuyên Quang",
        "Thanh Hóa",
        "Nghệ An"
      ]
    },
    {
      name: "ZONE_CENTRAL",
      fee: 35000,
      provinces: [
        "Hà Tĩnh",
        "Quảng Trị",
        "Huế",
        "Đà Nẵng",
        "Quảng Ngãi",
        "Gia Lai",
        "Đắk Lắk",
        "Khánh Hòa",
        "Lâm Đồng"
      ]
    },
    {
      name: "ZONE_SOUTH",
      fee: 40000,
      provinces: [
        "Tây Ninh",
        "Đồng Nai",
        "Hồ Chí Minh",
        "Đồng Tháp",
        "Vĩnh Long",
        "Cần Thơ",
        "An Giang",
        "Cà Mau"
      ]
    }
  ]
};

module.exports = SHIPPING_CONFIG;