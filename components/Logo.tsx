import Image from "next/image";
import Link from "next/link";

export default function Logo({ href, label }: { href: string; label: string }) {
  return (
    <Link className="logo" href={href} aria-label={label}>
      <Image src="/images/logo.webp" width={62} height={62} alt="Vorx Industrial Solutions" priority />
    </Link>
  );
}
