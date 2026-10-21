# İstanbul Arel Üniversitesi · Kurum İçi Duyuru Yönetim Sistemi (`arel-duyuru-sistemi`)

Bu depo, İstanbul Arel Üniversitesi akademik ve idari birimlerinin kurum içi duyurularını **Outlook HTML E-Posta, Kurum İçi Portal ve Mobil Push Notification** kanallarında standartlaştırarak yayımlamasını ve **İletişim Ofisi Pop-up Onay Sürecini** yöneten uygulama deposudur.

## Hızlı Başlangıç

```bash
npm install
npm run dev
```

## Kalite ve Mimari Doğrulama

Geliştirme sırasında kodunuzun mimari kurallara (`ARCHITECTURE.md`) ve sözleşmelere (`contracts/`) uygunluğunu doğrulamak için:

```bash
npm run typecheck
npm run lint
npm run build
```

## Sözleşme ve Mimari Referanslar

- **Mimari Kurallar ve Ekran Gereksinimleri:** [`ARCHITECTURE.md`](ARCHITECTURE.md)
- **OpenAPI 3.1 Sözleşmesi:** [`contracts/openapi.yaml`](contracts/openapi.yaml)
- **Şablon Kataloğu Şeması:** [`contracts/template-catalog.schema.json`](contracts/template-catalog.schema.json)
- **İletişim Ofisi Onay Durum Makinesi:** [`contracts/approval-workflow.json`](contracts/approval-workflow.json)
- **Birim ve Rol Yetki Matrisi (RBAC):** [`contracts/role-permissions.json`](contracts/role-permissions.json)
