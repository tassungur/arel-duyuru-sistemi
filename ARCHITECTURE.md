# İstanbul Arel Üniversitesi — Kurum İçi Duyuru Yönetim Sistemi (`arel-duyuru-sistemi`)

Bu proje, İstanbul Arel Üniversitesi bünyesindeki akademik ve idari birimlerin kurum içi duyurularını kendi yetkileri çerçevesinde hazırladığı, **Kurumsal İletişim Ofisi**'nin anlık pop-up bildirim ve ön izleme üzerinden kontrol ederek onayladığı, **Outlook HTML E-Posta + Kurum İçi Portal + Mobil Push Notification** kanallarına entegre çalışan merkezi duyuru yönetim sistemidir.

---

## 1. Katmanlı Mimari Kuralları (`src/`)

Geliştirme sürecinde aşağıdaki dizin ve katman yapısına birebir uyulması zorunludur:

- `contracts/`: Bağlayıcı OpenAPI 3.1 sözleşmesi (`openapi.yaml`), 8 ana şablon ailesi JSON şeması (`template-catalog.schema.json`), İletişim Ofisi onay durum geçiş makinesi (`approval-workflow.json`) ve birim bazlı yetki matrisi (`role-permissions.json`).
- `src/types/`: Backend OpenAPI sözleşmesiyle birebir uyumlu TypeScript arayüzleri (`AnnouncementSummaryDto`, `ApprovalDecisionRequest`, `ProblemDetails`).
- `src/services/`: Merkezi HTTP istemcisi (`apiClient.ts`). Her istekte `X-Tenant-Code` ve `Authorization: Bearer <JWT>` başlıklarını zorunlu olarak iletir.
- `src/templates/`: Outlook masaüstü (Word render motoru uyumlu `table-based`, `inline-CSS`, `VML v:roundrect` buton) ve mobil (`375px` responsive) HTML e-posta üretici katmanı.
- `src/features/` ve `src/pages/`:
  1. **Birim Duyuru Hazırlama & Canlı Önizleme Ekranı:** Şablon seçimi, dinamik form alanları, onaylı görsel kütüphanesi seçici ve eşzamanlı Masaüstü / Mobil E-Posta / Mobil Push Notification önizlemesi.
  2. **İletişim Ofisi Kontrol & Pop-up Onay Ekranı:** Birimlerden gelen duyuruların anlık pop-up bildirimle düşmesi, gerçek HTML önizlemesi, onaylama veya 5 standart nedenle (*Yazım hatası, Görsel uygun değil, Eksik bilgi, Yanlış hedef kitle, Kurumsal kimliğe aykırı kullanım*) revizyona gönderme ekranı.

---

## 2. Kodlanacak Zorunlu Şablon Aileleri ve Kurumsal Kilit Kuralları

1. **Kilitli Kurumsal Kimlik Alanları:**
   - Arel Üniversitesi logosu, üst/alt kurumsal bant, birim renk paleti (`#00539b` Arel Laciverti, `#1e3a5f` Rektörlük Laciverti, `#8a1538` İK Bordo, `#ab8e58` Arel Altını, `#b91c1c` İSG Kırmızı) ve yazı tipi (`Segoe UI`) şablon içinde **kilitli** olmalı; son kullanıcı tarafından değiştirilememelidir.
2. **Birim Bazlı Hazır Şablon Setleri (`contracts/role-permissions.json`):**
   - **İnsan Kaynakları (6 Şablon):** *Hoş Geldiniz (Yeni Başlayanlar), Terfi / Görev Değişikliği, Genel Kurum İçi Duyuru, Kıyafet Yönetmeliği Hatırlatması, İK Eğitimi / Seminer, Otomatik Doğum Günü Kutlaması*.
   - **Kariyer Merkezi — ARELKAM (4 Şablon):** *Staj Başvuruları Başladı, Markalı Dersler / Özel Programlar, Etkinlik / Konuk Konuşmacı, İş Fırsatları / Mezun İlanları*.
   - **Rektörlük & İSG (2 Şablon):** *Rektörlük Resmi & Önemli Duyuru, İSG Kritik Uyarı ve Acil Bildirim*.

---

## 3. Kod Kalitesi ve Mimari Standartlar (`CI Quality Gate`)

Her Pull Request ve `main`/`develop` push işleminde otomatik çalışan kalite kapısı aşağıdaki kuralları denetler:

1. **Katman Sınırı (`ARCH-01`):** `src/pages/` ve `src/components/` katmanlarında doğrudan `fetch` veya `axios` çağrısı yapılamaz; tüm API çağrıları `src/services/` üzerinden geçmelidir.
2. **Modüler Dosya Boyutu (`ARCH-02`):** Tek bir `.ts` veya `.tsx` dosyası en fazla **250 satır** olabilir.
3. **Tip Güvenliği (`ARCH-03`):** `any`, `@ts-ignore` ve `@ts-nocheck` kullanımı yasaktır.
4. **Çoklu Birim İzolasyonu (`ARCH-04`):** Tüm yönetim isteklerinde aktif birimin `X-Tenant-Code` başlığı (`apiClient.ts` üzerinden) gönderilmelidir.
5. **Güvenlik (`SEC-01`):** Sanitize edilmemiş `dangerouslySetInnerHTML` veya `eval()` kullanımı yasaktır.
