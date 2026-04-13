import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog/dialog";
import { Button } from "./ui/button/button";
import { Input } from "./ui/input/input";
import { Label } from "./ui/label/label";
import type { Database } from "~/db/types";
import styles from "./anak-form-dialog.module.css";

type ImunisasiRow = Database["public"]["Tables"]["imunisasi"]["Row"];
type ImunisasiInsert = Database["public"]["Tables"]["imunisasi"]["Insert"];

interface ImunisasiFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ImunisasiInsert) => void;
  imunisasi?: ImunisasiRow | null;
  anakId: string;
}

interface FormData {
  nama_imunisasi: string;
  tanggal: string;
}

export function ImunisasiFormDialog({ open, onOpenChange, onSubmit, imunisasi, anakId }: ImunisasiFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      nama_imunisasi: imunisasi?.nama_imunisasi || "",
      tanggal: imunisasi?.tanggal || new Date().toISOString().split("T")[0],
    },
  });

  const handleFormSubmit = async (data: FormData) => {
    try {
      await onSubmit({
        ...data,
        anak_id: anakId,
        ...(imunisasi && { id: imunisasi.id }),
      });
      reset();
    } catch (error) {
      console.error("Error in imunisasi form submit:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={styles.dialog}>
        <DialogHeader>
          <DialogTitle>{imunisasi ? "Edit Data Imunisasi" : "Tambah Data Imunisasi"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
          <div className={styles.field}>
            <Label htmlFor="nama_imunisasi">Nama Imunisasi</Label>
            <Input
              id="nama_imunisasi"
              {...register("nama_imunisasi", { required: "Nama imunisasi wajib diisi" })}
              placeholder="Contoh: BCG, Polio, DPT-HB-Hib"
            />
            {errors.nama_imunisasi && <span className={styles.error}>{errors.nama_imunisasi.message}</span>}
          </div>

          <div className={styles.field}>
            <Label htmlFor="tanggal">Tanggal Imunisasi</Label>
            <Input
              id="tanggal"
              type="date"
              {...register("tanggal", { required: "Tanggal imunisasi wajib diisi" })}
            />
            {errors.tanggal && <span className={styles.error}>{errors.tanggal.message}</span>}
          </div>

          <div className={styles.actions}>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit">{imunisasi ? "Simpan Perubahan" : "Tambah Data"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
