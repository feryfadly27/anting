import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog/dialog";
import { Button } from "./ui/button/button";
import { Input } from "./ui/input/input";
import { Label } from "./ui/label/label";
import type { Database } from "~/db/types";
import styles from "./anak-form-dialog.module.css";

type PertumbuhanRow = Database["public"]["Tables"]["pertumbuhan"]["Row"];
type PertumbuhanInsert = Database["public"]["Tables"]["pertumbuhan"]["Insert"];

interface PertumbuhanFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PertumbuhanInsert) => void;
  pertumbuhan?: PertumbuhanRow | null;
  anakId: string;
}

interface FormData {
  tanggal_pengukuran: string;
  berat_badan: number;
  tinggi_badan: number;
}

export function PertumbuhanFormDialog({ open, onOpenChange, onSubmit, pertumbuhan, anakId }: PertumbuhanFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      tanggal_pengukuran: pertumbuhan?.tanggal_pengukuran || new Date().toISOString().split("T")[0],
      berat_badan: pertumbuhan?.berat_badan || 0,
      tinggi_badan: pertumbuhan?.tinggi_badan || 0,
    },
  });

  const handleFormSubmit = async (data: FormData) => {
    try {
      await onSubmit({
        ...data,
        berat_badan: Number(data.berat_badan),
        tinggi_badan: Number(data.tinggi_badan),
        anak_id: anakId,
        ...(pertumbuhan && { id: pertumbuhan.id }),
      });
      reset();
    } catch (error) {
      console.error("Error in form submit:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={styles.dialog}>
        <DialogHeader>
          <DialogTitle>{pertumbuhan ? "Edit Data Pertumbuhan" : "Tambah Data Pertumbuhan"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
          <div className={styles.field}>
            <Label htmlFor="tanggal_pengukuran">Tanggal Pengukuran</Label>
            <Input
              id="tanggal_pengukuran"
              type="date"
              {...register("tanggal_pengukuran", { required: "Tanggal pengukuran wajib diisi" })}
            />
            {errors.tanggal_pengukuran && <span className={styles.error}>{errors.tanggal_pengukuran.message}</span>}
          </div>

          <div className={styles.field}>
            <Label htmlFor="berat_badan">Berat Badan (kg)</Label>
            <Input
              id="berat_badan"
              type="number"
              step="0.01"
              {...register("berat_badan", {
                required: "Berat badan wajib diisi",
                min: { value: 0.1, message: "Berat badan minimal 0.1 kg" },
                max: { value: 100, message: "Berat badan maksimal 100 kg" },
              })}
              placeholder="Contoh: 12.5"
            />
            {errors.berat_badan && <span className={styles.error}>{errors.berat_badan.message}</span>}
          </div>

          <div className={styles.field}>
            <Label htmlFor="tinggi_badan">Tinggi Badan (cm)</Label>
            <Input
              id="tinggi_badan"
              type="number"
              step="0.01"
              {...register("tinggi_badan", {
                required: "Tinggi badan wajib diisi",
                min: { value: 10, message: "Tinggi badan minimal 10 cm" },
                max: { value: 200, message: "Tinggi badan maksimal 200 cm" },
              })}
              placeholder="Contoh: 75.5"
            />
            {errors.tinggi_badan && <span className={styles.error}>{errors.tinggi_badan.message}</span>}
          </div>

          <div className={styles.actions}>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit">{pertumbuhan ? "Simpan Perubahan" : "Tambah Data"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
