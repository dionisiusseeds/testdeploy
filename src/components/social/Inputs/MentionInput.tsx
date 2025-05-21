import { useEffect, useRef } from 'react'
import { Mention, MentionsInput } from 'react-mentions'

interface AutoHeightMentionsInputProps {
  value: string
  onChange: (event: any) => void
  placeholder?: string
}

const AutoHeightMentionsInput = ({
  value,
  onChange,
  placeholder
}: AutoHeightMentionsInputProps): JSX.Element => {
  const inputRef = useRef<HTMLDivElement | null>(null)

  // Fungsi untuk menyesuaikan tinggi berdasarkan konten
  const adjustHeight = (): void => {
    if (inputRef.current != null) {
      const textarea = inputRef.current.querySelector('textarea') // Cari textarea di dalam MentionsInput
      if (textarea != null) {
        textarea.style.height = 'auto' // Reset height sebelum dihitung ulang
        textarea.style.height = `${textarea.scrollHeight}px` // Set height sesuai teks
      }
    }
  }

  useEffect(() => {
    adjustHeight() // Jalankan saat pertama kali dimuat atau teks berubah
  }, [value])

  return (
    <div className="relative w-full flex items-stretch">
      <MentionsInput
        // inputRef={inputRef} // Simpan ref ke wrapper MentionsInput
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onInput={adjustHeight} // Panggil saat mengetik agar tinggi langsung berubah
        style={{
          outline: 'none',
          minHeight: 'auto', // Biarkan height mengikuti konten
          resize: 'none', // Mencegah user resize manual
          overflow: 'hidden', // Mencegah scrollbar muncul
          padding: '10px', // Tambahkan padding agar placeholder tidak tertutup
          fontSize: '16px', // Pastikan ukuran teks cukup besar agar tidak terpotong
          lineHeight: '1.5', // Tambahkan line-height agar teks tidak tumpang tindih
          wordWrap: 'break-word' // Pastikan teks tidak keluar dari container
        }}
        className="w-full MentionInputTextArea bg-transparent font-poppins text-base placeholder:text-neutral-soft"
        a11ySuggestionsListLabel={'Suggested mentions'}
      >
        <Mention
          trigger={'@'}
          data={[]}
          markup="@[__display__](__id__)"
          style={{ color: '#4FE6AF' }}
        />
        <Mention
          trigger={'$'}
          data={[]}
          markup="$[__display__](__id__)"
          style={{ color: '#4FE6AF' }}
        />
        <Mention
          trigger={'#'}
          data={[]}
          markup="#[__display__]()"
          style={{ color: '#4FE6AF' }}
        />
      </MentionsInput>
    </div>
  )
}

export default AutoHeightMentionsInput
