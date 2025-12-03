import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { Avatar } from "../Avatar";
import { Star } from "../icons/Star";
import styles from "./cardpost.module.css";
import Link from "next/link";
import { ThumbsUpButton } from "./ThumbsUpButton";
import { ModalComment } from "../ModalComment";

export const CardPost = ({ post, highlight, rating, category, isFetching, currentPage }) => {
  const queryClient = useQueryClient();

  const ThumbsMutation = useMutation({
    mutationFn: (postData) => {
      return fetch(`http://localhost:3000/api/thumbs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      }).then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts", post.slug]);
      queryClient.invalidateQueries(["posts", currentPage]);
    },
    onError: (error, variables) => {
      console.error(`Error ao salvar o thumbsUp para o slug: ${variables.slug}`, { error });
    }
  })

  const subtmitCommentMutation = useMutation({
    mutationFn: (commentData) => {
      return fetch(`http://localhost:3000/api/comment/${post.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commentData),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts", post.slug]);
      queryClient.invalidateQueries(["posts", currentPage]);
    },
    onError: (error, variables) => {
      console.error(`Error ao salvar o comentário para o slug: ${variables.slug}`, { error });
    }
  })

  const onSubmitComment = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const text = formData.get("text");

    subtmitCommentMutation.mutate({ id: post.id, text })
  };

  return (
    <article className={styles.card} style={{ width: highlight ? 993 : 486 }}>
      <header className={styles.header}>
        <figure style={{ height: highlight ? 300 : 133 }}>
          <Image
            src={post.cover}
            fill
            alt={`Capa do post de titulo: ${post.title}`}
          />
        </figure>
      </header>
      <section className={styles.body}>
        <h2>{post.title}</h2>
        <p>{post.body}</p>
        <Link href={`/posts/${post.slug}`}>Ver detalhes</Link>
      </section>
      <footer className={styles.footer}>
        <div className={styles.actions}>
          <form onClick={(event) => {
            event.preventDefault();
            ThumbsMutation.mutate({ slug: post.slug });
          }}>
            <ThumbsUpButton disable={isFetching} />
            {ThumbsMutation.isError && (
              <p className={styles.ThumbsUpButtonMessage}>Erro ao registrar o like</p>
            )}
            <p>{post.likes}</p>
          </form>
          <div>
            <ModalComment onSubmit={onSubmitComment} />
            <p>{post.comments.length}</p>
          </div>
          {rating && (
            <div style={{ margin: "0 3px" }}>
              <Star />
              <p style={{ marginTop: "1px" }}>{rating}</p>
            </div>
          )}
        </div>
        {category && (
          <div
            className={styles.categoryWrapper}
            style={{ fontSize: highlight ? "15px" : "12px" }}
          >
            <span className={styles.label}>Categoria: </span>{" "}
            <span className={styles.category}>{category}</span>
          </div>
        )}
        <Avatar imageSrc={post.author.avatar} name={post.author.username} />
      </footer>
    </article>
  );
};
